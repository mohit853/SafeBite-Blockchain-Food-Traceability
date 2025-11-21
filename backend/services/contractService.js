/**
 * Contract Service
 * Handles all interactions with SafeBite smart contracts using Ethers.js
 * 
 * TODO: Implement all contract interaction methods
 * - Load contract ABIs from artifacts
 * - Initialize provider and contract instances
 * - Implement all contract function calls
 * - Handle transaction receipts and errors
 */

const { ethers } = require('ethers');
const { loadContractAddresses, loadContractABI, generateCertificateHash, mergeCertificateMetadata } = require('../utils/helpers');

class ContractService {
  constructor() {
    this.provider = null;
    this.accessControlContract = null;
    this.supplyChainContract = null;
    this.contractAddresses = null;
  }

  /**
   * Initialize the contract service
   * Loads contract ABIs, creates provider, and initializes contract instances
   * 
   * Loads contract addresses from deployments file, creates provider from RPC_URL,
   * loads ABIs from artifacts, and creates contract instances for read-only operations.
   * For write operations, contracts are connected to signers dynamically.
   * 
   * @throws {Error} If contracts not deployed or network not available
   */
  async initialize() {
    try {
      // Load contract addresses from deployments file
      this.contractAddresses = loadContractAddresses();
      
      // Create provider using RPC_URL from environment (default to localhost:8545)
      const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Verify provider connection
      await this.provider.getBlockNumber();
      
      // Load contract ABIs from artifacts
      const accessControlABI = loadContractABI('SafeBiteAccessRoles');
      const supplyChainABI = loadContractABI('SafeBiteSupplyChain');
      
      // Create contract instances (read-only, connected to provider)
      this.accessControlContract = new ethers.Contract(
        this.contractAddresses.accessControl,
        accessControlABI,
        this.provider
      );
      
      this.supplyChainContract = new ethers.Contract(
        this.contractAddresses.supplyChain,
        supplyChainABI,
        this.provider
      );
      
      console.log('Contract service initialized successfully');
      console.log(`Access Control: ${this.contractAddresses.accessControl}`);
      console.log(`Supply Chain: ${this.contractAddresses.supplyChain}`);
    } catch (error) {
      console.error('Failed to initialize contract service:', error.message);
      throw new Error(`Contract service initialization failed: ${error.message}`);
    }
  }

  /**
   * Get user role from access control contract
   * 
   * @param {string} address - User wallet address
   * @returns {Promise<number>} Role enum value (0=PRODUCER, 1=DISTRIBUTOR, etc.)
   * 
   * Calls accessControl.getRole(address) and returns the role number.
   * Returns 4 (CONSUMER) as default if address has no assigned role.
   */
  async getUserRole(address) {
    if (!this.accessControlContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const role = await this.accessControlContract.getRole(address);
      return Number(role);
    } catch (error) {
      throw new Error(`Failed to get user role: ${error.message}`);
    }
  }

  /**
   * Check if user has specific role
   * 
   * @param {string} address - User wallet address
   * @param {number} role - Role enum value
   * @returns {Promise<boolean>} True if user has the role
   * 
   * Calls accessControl.hasRole(address, role) and returns boolean result.
   * CONSUMER role (4) always returns true for any address.
   */
  async hasRole(address, role) {
    if (!this.accessControlContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const hasRoleResult = await this.accessControlContract.hasRole(address, role);
      return hasRoleResult;
    } catch (error) {
      throw new Error(`Failed to check role: ${error.message}`);
    }
  }

  /**
   * Register a new product
   * 
   * @param {string} signerAddress - Address of the producer (must have PRODUCER role)
   * @param {string} name - Product name
   * @param {string} batchId - Batch identifier
   * @param {string} origin - Origin location
   * @param {string} metadataHash - IPFS hash or metadata reference
   * @returns {Promise<Object>} Transaction receipt with productId
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls registerProduct(), waits for transaction, parses ProductRegistered event
   * to extract productId, and returns transaction hash and productId.
   */
  async registerProduct(signerAddress, name, batchId, origin, metadataHash) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call registerProduct function
      const tx = await contractWithSigner.registerProduct(name, batchId, origin, metadataHash || '');
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Parse ProductRegistered event to get productId
      let productId = null;
      if (receipt.logs) {
        const eventInterface = this.supplyChainContract.interface;
        for (const log of receipt.logs) {
          try {
            const parsedLog = eventInterface.parseLog(log);
            if (parsedLog && parsedLog.name === 'ProductRegistered') {
              productId = Number(parsedLog.args.productId);
              break;
            }
          } catch (e) {
            // Not the event we're looking for, continue
          }
        }
      }
      
      // If event parsing failed, try to get productId from return value
      if (productId === null) {
        // In some cases, the function returns the productId directly
        const result = await tx.wait();
        // Try to decode from transaction data or use getProductCount
        const count = await this.getProductCount();
        productId = count; // Last registered product
      }
      
      return {
        transactionHash: receipt.hash,
        productId: productId,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to register product: ${error.message}`);
    }
  }

  /**
   * Get product information
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product data with owner, status, and authenticity flag
   * 
   * Calls supplyChain.getProduct(productId), getCurrentOwner(productId),
   * getProductStatus(productId), and isProductAuthentic(productId),
   * then returns formatted product object with all information.
   */
  async getProduct(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get product data
      const productData = await this.supplyChainContract.getProduct(productId);
      
      // Get additional information
      const [currentOwner, status, isAuthentic] = await Promise.all([
        this.supplyChainContract.getCurrentOwner(productId),
        this.supplyChainContract.getProductStatus(productId),
        this.supplyChainContract.isProductAuthentic(productId)
      ]);
      
      return {
        id: productId,
        name: productData.name,
        batchId: productData.batchId,
        producer: productData.producer,
        createdAt: Number(productData.createdAt),
        origin: productData.origin,
        metadataHash: productData.metadataHash,
        currentOwner: currentOwner,
        status: Number(status),
        isAuthentic: isAuthentic
      };
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  /**
   * Get product journey timeline
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} Array of journey events as strings with formatted timestamps
   * 
   * Calls supplyChain.getProductJourney(productId), extracts timestamps from journey strings,
   * formats them as readable dates, and returns formatted journey array.
   */
  async getProductJourney(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const journey = await this.supplyChainContract.getProductJourney(productId);
      
      // Format timestamps in journey strings
      // Journey strings come as: "Product registered: ... at 1763688372" or "Transferred from ... to ... at 1763688372"
      const formattedJourney = journey.map(event => {
        // Extract timestamp (number at the end after "at ")
        const timestampMatch = event.match(/at (\d+)$/);
        if (timestampMatch) {
          const timestamp = parseInt(timestampMatch[1], 10);
          // Format timestamp to readable date
          const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
          const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          // Replace timestamp with formatted date
          return event.replace(/at \d+$/, `at ${formattedDate}`);
        }
        return event;
      });
      
      return formattedJourney;
    } catch (error) {
      throw new Error(`Failed to get product journey: ${error.message}`);
    }
  }

  /**
   * Get complete product provenance
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<string>} JSON string with complete provenance data
   * 
   * Calls supplyChain.getCompleteProvenance(productId) and returns JSON string
   * containing all product data, transfers, and verifications.
   */
  async getCompleteProvenance(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const provenance = await this.supplyChainContract.getCompleteProvenance(productId);
      return provenance;
    } catch (error) {
      throw new Error(`Failed to get complete provenance: ${error.message}`);
    }
  }

  /**
   * Transfer product ownership
   * 
   * @param {string} signerAddress - Current owner address
   * @param {number} productId - Product ID
   * @param {string} toAddress - Recipient address
   * @param {string} shipmentDetails - Shipping information
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls transferOwnership(productId, toAddress, shipmentDetails),
   * waits for transaction, and returns receipt with transaction hash.
   */
  async transferOwnership(signerAddress, productId, toAddress, shipmentDetails) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call transferOwnership function
      const tx = await contractWithSigner.transferOwnership(productId, toAddress, shipmentDetails || '');
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to transfer ownership: ${error.message}`);
    }
  }

  /**
   * Batch transfer multiple products
   * 
   * @param {string} signerAddress - Current owner address
   * @param {Array<number>} productIds - Array of product IDs
   * @param {string} toAddress - Recipient address
   * @param {string} shipmentDetails - Shipping information
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls batchTransferOwnership(productIds, toAddress, shipmentDetails),
   * waits for transaction, and returns receipt with transaction hash.
   */
  async batchTransferOwnership(signerAddress, productIds, toAddress, shipmentDetails) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call batchTransferOwnership function
      const tx = await contractWithSigner.batchTransferOwnership(productIds, toAddress, shipmentDetails || '');
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to batch transfer ownership: ${error.message}`);
    }
  }

  /**
   * Get transfer history for a product
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} Array of transfer records
   * 
   * Calls supplyChain.getTransferHistory(productId) and returns formatted
   * transfer records with from, to, timestamp, and shipmentDetails.
   */
  async getTransferHistory(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const transfers = await this.supplyChainContract.getTransferHistory(productId);
      
      // Format transfer records
      return transfers.map(transfer => ({
        from: transfer.from,
        to: transfer.to,
        timestamp: Number(transfer.timestamp),
        shipmentDetails: transfer.shipmentDetails
      }));
    } catch (error) {
      throw new Error(`Failed to get transfer history: ${error.message}`);
    }
  }

  /**
   * Update product status
   * 
   * @param {string} signerAddress - Current owner address
   * @param {number} productId - Product ID
   * @param {number} newStatus - Status enum value (0=CREATED, 1=SHIPPED, etc.)
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls updateStatus(productId, newStatus), waits for transaction,
   * and returns receipt with transaction hash.
   */
  async updateStatus(signerAddress, productId, newStatus) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call updateStatus function
      const tx = await contractWithSigner.updateStatus(productId, newStatus);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  /**
   * Verify product authenticity
   * 
   * @param {string} signerAddress - Verifier address (anyone can verify)
   * @param {number} productId - Product ID
   * @param {string} notes - Verification notes
   * @returns {Promise<Object>} Verification result with isValid boolean
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls verifyAuthenticity(productId, notes), waits for transaction,
   * then checks the authenticity flag to get the result, and returns transaction hash and result.
   */
  async verifyAuthenticity(signerAddress, productId, notes) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call verifyAuthenticity function (returns boolean, but we'll check the flag after)
      const tx = await contractWithSigner.verifyAuthenticity(productId, notes || '');
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Check the authenticity flag after the transaction
      const isValid = await this.isProductAuthentic(productId);
      
      return {
        transactionHash: receipt.hash,
        isValid: isValid,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to verify authenticity: ${error.message}`);
    }
  }

  /**
   * Perform quality check
   * 
   * @param {string} signerAddress - Retailer or Regulator address
   * @param {number} productId - Product ID
   * @param {number} qualityScore - Quality score (0-100)
   * @param {string} notes - Quality check notes
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls performQualityCheck(productId, qualityScore, notes), waits for transaction,
   * generates quality certificate hash, merges with existing metadataHash, and updates it.
   * Returns receipt with transaction hash.
   */
  async performQualityCheck(signerAddress, productId, qualityScore, notes) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Generate quality certificate hash
      const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const qualityCertificateHash = generateCertificateHash({
        productId,
        type: 'QUALITY_CHECK',
        verifier: signerAddress,
        result: qualityScore,
        notes: notes || '',
        timestamp
      });
      
      // Get current product to retrieve existing metadataHash
      const product = await this.getProduct(productId);
      const existingMetadataHash = product.metadataHash || '';
      
      // Merge quality certificate with existing metadata
      const mergedMetadataHash = mergeCertificateMetadata(existingMetadataHash, 'quality', qualityCertificateHash);
      
      // Call performQualityCheck function with merged certificate hash
      // Contract will store it if quality check passes
      const tx = await contractWithSigner.performQualityCheck(
        productId, 
        qualityScore, 
        notes || '', 
        mergedMetadataHash
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        qualityCertificateHash
      };
    } catch (error) {
      throw new Error(`Failed to perform quality check: ${error.message}`);
    }
  }

  /**
   * Perform compliance check (Regulator only)
   * 
   * @param {string} signerAddress - Regulator address
   * @param {number} productId - Product ID
   * @param {boolean} compliant - Compliance result
   * @param {string} certificateHash - Certificate hash if compliant (optional, will be auto-generated if not provided)
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * auto-generates certificate hash if not provided and product is compliant,
   * merges with existing metadataHash (e.g., quality certificate),
   * calls checkCompliance(productId, compliant, mergedCertificateHash), waits for transaction,
   * and returns receipt with transaction hash.
   */
  async checkCompliance(signerAddress, productId, compliant, certificateHash) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      let finalCertificateHash = certificateHash || '';
      
      // Auto-generate certificate hash if not provided and product is compliant
      if (compliant && !finalCertificateHash) {
        const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        finalCertificateHash = generateCertificateHash({
          productId,
          type: 'COMPLIANCE',
          verifier: signerAddress,
          result: compliant,
          notes: 'Compliance certificate',
          timestamp
        });
      }
      
      // If compliant and we have a certificate hash, merge with existing metadata
      if (compliant && finalCertificateHash) {
        // Get current product to retrieve existing metadataHash
        const product = await this.getProduct(productId);
        const existingMetadataHash = product.metadataHash || '';
        
        // Merge compliance certificate with existing metadata (e.g., quality certificate)
        const mergedMetadataHash = mergeCertificateMetadata(existingMetadataHash, 'compliance', finalCertificateHash);
        finalCertificateHash = mergedMetadataHash;
      }
      
      // Call checkCompliance function (this will auto-verify authenticity if conditions are met)
      const tx = await contractWithSigner.checkCompliance(productId, compliant, finalCertificateHash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Check if authenticity was auto-verified after compliance check
      let isAuthentic = false;
      if (compliant) {
        try {
          isAuthentic = await this.isProductAuthentic(productId);
        } catch (err) {
          // If check fails, continue without authenticity status
          console.warn('Could not check authenticity status:', err.message);
        }
      }
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        certificateHash: finalCertificateHash,
        isAuthentic: isAuthentic,
        autoVerified: isAuthentic && compliant // True if authenticity was auto-verified
      };
    } catch (error) {
      throw new Error(`Failed to check compliance: ${error.message}`);
    }
  }

  /**
   * Get verification history for a product
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} Array of verification records
   * 
   * Calls supplyChain.getVerificationHistory(productId) and returns formatted
   * verification records with verifier, timestamp, type, result, and notes.
   */
  async getVerificationHistory(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const verifications = await this.supplyChainContract.getVerificationHistory(productId);
      
      // Format verification records
      return verifications.map(verification => {
        // Ensure vType is a valid number
        let vType = Number(verification.vType);
        if (isNaN(vType)) {
          // If vType is invalid, default to 0 (QUALITY_CHECK)
          vType = 0;
        }
        
        return {
          verifier: verification.verifier,
          timestamp: Number(verification.timestamp),
          vType: vType, // 0=QUALITY_CHECK, 1=REGULATORY_APPROVAL, 2=AUTHENTICITY, 3=COMPLIANCE
          type: vType, // Also include as 'type' for backward compatibility
          result: verification.result,
          notes: verification.notes
        };
      });
    } catch (error) {
      throw new Error(`Failed to get verification history: ${error.message}`);
    }
  }

  /**
   * Check if product is authentic
   * 
   * @param {number} productId - Product ID
   * @returns {Promise<boolean>} True if product is verified as authentic
   * 
   * Calls supplyChain.isProductAuthentic(productId) and returns boolean result.
   */
  async isProductAuthentic(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const isAuthentic = await this.supplyChainContract.isProductAuthentic(productId);
      return isAuthentic;
    } catch (error) {
      throw new Error(`Failed to check product authenticity: ${error.message}`);
    }
  }

  /**
   * Get product count
   * 
   * @returns {Promise<number>} Total number of registered products
   * 
   * Calls supplyChain.getProductCount() and returns the count as a number.
   */
  async getProductCount() {
    if (!this.supplyChainContract) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      const count = await this.supplyChainContract.getProductCount();
      return Number(count);
    } catch (error) {
      throw new Error(`Failed to get product count: ${error.message}`);
    }
  }

  /**
   * Grant role to an address (admin function for demo setup)
   * 
   * @param {string} signerAddress - Admin address (contract owner)
   * @param {string} accountAddress - Address to grant role to
   * @param {number} role - Role enum value
   * @returns {Promise<Object>} Transaction receipt with transaction hash
   * 
   * Gets signer from provider, connects access control contract to signer,
   * calls grantRole(accountAddress, role), waits for transaction, and returns receipt.
   */
  async grantRole(signerAddress, accountAddress, role) {
    if (!this.accessControlContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider (for Hardhat local node, this works)
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.accessControlContract.connect(signer);
      
      // Call grantRole function
      const tx = await contractWithSigner.grantRole(accountAddress, role);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to grant role: ${error.message}`);
    }
  }

  /**
   * Update product metadata
   * 
   * @param {string} signerAddress - Current owner address
   * @param {number} productId - Product ID
   * @param {string} metadataHash - New metadata hash
   * @returns {Promise<Object>} Transaction receipt
   * 
   * Gets signer from provider, connects supply chain contract to signer,
   * calls updateProductMetadata(productId, metadataHash), waits for transaction,
   * and returns receipt with transaction hash.
   */
  async updateProductMetadata(signerAddress, productId, metadataHash) {
    if (!this.supplyChainContract || !this.provider) {
      throw new Error('Contract service not initialized');
    }
    
    try {
      // Get signer from provider
      const signer = await this.provider.getSigner(signerAddress);
      
      // Connect contract to signer for write operations
      const contractWithSigner = this.supplyChainContract.connect(signer);
      
      // Call updateProductMetadata function
      const tx = await contractWithSigner.updateProductMetadata(productId, metadataHash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to update product metadata: ${error.message}`);
    }
  }
}

// Export singleton instance
const contractService = new ContractService();
module.exports = contractService;

