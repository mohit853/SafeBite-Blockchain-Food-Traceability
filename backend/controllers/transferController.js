/**
 * Transfer Controller
 * Handles product ownership transfer operations
 */

const contractService = require('../services/contractService');
const { formatError } = require('../utils/errors');
const { isValidAddress, isValidProductId } = require('../utils/helpers');

/**
 * Transfer product ownership
 * POST /api/transfers
 * 
 * Body: { signerAddress, productId, toAddress, shipmentDetails }
 * 
 * Validates inputs (signerAddress, productId, toAddress, shipmentDetails),
 * calls contractService.transferOwnership(), and returns transaction hash.
 */
async function transferOwnership(req, res) {
  try {
    const { signerAddress, productId, toAddress, shipmentDetails } = req.body;
    
    // Validate all inputs
    if (!signerAddress || !isValidAddress(signerAddress)) {
      return res.status(400).json(formatError(new Error('Invalid signer address'), 'transferOwnership'));
    }
    if (!isValidProductId(productId)) {
      return res.status(400).json(formatError(new Error('Invalid product ID'), 'transferOwnership'));
    }
    if (!toAddress || !isValidAddress(toAddress)) {
      return res.status(400).json(formatError(new Error('Invalid recipient address'), 'transferOwnership'));
    }
    
    // Call contractService.transferOwnership()
    const result = await contractService.transferOwnership(signerAddress, productId, toAddress, shipmentDetails || '');
    
    // Return transaction hash
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      message: 'Ownership transferred successfully'
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'transferOwnership'));
  }
}

/**
 * Batch transfer multiple products
 * POST /api/transfers/batch
 * 
 * Body: { signerAddress, productIds: [], toAddress, shipmentDetails }
 * 
 * Validates inputs (productIds must be array), calls contractService.batchTransferOwnership(),
 * and returns transaction hash.
 */
async function batchTransferOwnership(req, res) {
  try {
    const { signerAddress, productIds, toAddress, shipmentDetails } = req.body;
    
    // Validate inputs (productIds must be array)
    if (!signerAddress || !isValidAddress(signerAddress)) {
      return res.status(400).json(formatError(new Error('Invalid signer address'), 'batchTransferOwnership'));
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json(formatError(new Error('productIds must be a non-empty array'), 'batchTransferOwnership'));
    }
    for (const id of productIds) {
      if (!isValidProductId(id)) {
        return res.status(400).json(formatError(new Error(`Invalid product ID: ${id}`), 'batchTransferOwnership'));
      }
    }
    if (!toAddress || !isValidAddress(toAddress)) {
      return res.status(400).json(formatError(new Error('Invalid recipient address'), 'batchTransferOwnership'));
    }
    
    // Call contractService.batchTransferOwnership()
    const result = await contractService.batchTransferOwnership(signerAddress, productIds, toAddress, shipmentDetails || '');
    
    // Return transaction hash
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      message: `Transferred ${productIds.length} products successfully`
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'batchTransferOwnership'));
  }
}

/**
 * Get transfer history for a product
 * GET /api/transfers/:productId
 * 
 * Validates product ID, calls contractService.getTransferHistory() which already formats
 * transfer records (converts addresses, timestamps), and returns transfer history.
 */
async function getTransferHistory(req, res) {
  try {
    const productId = parseInt(req.params.productId);
    
    // Validate productId
    if (!isValidProductId(productId)) {
      return res.status(400).json(formatError(new Error('Invalid product ID'), 'getTransferHistory'));
    }
    
    // Call contractService.getTransferHistory() (already formats transfers)
    const transfers = await contractService.getTransferHistory(productId);
    
    // Return history
    res.json({
      success: true,
      transfers: transfers
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'getTransferHistory'));
  }
}

module.exports = {
  transferOwnership,
  batchTransferOwnership,
  getTransferHistory
};

