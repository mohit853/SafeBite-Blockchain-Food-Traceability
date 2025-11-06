// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "./SafeBiteAccessRoles.sol";

// Main supply chain contract for tracking products through the food supply chain
// Handles product registration, ownership transfers, status updates, and verification
contract SafeBiteSupplyChain {
    
    // Product status enum tracks where the product is in the supply chain
    // Status flows: CREATED -> SHIPPED -> RECEIVED -> STORED -> DELIVERED
    enum ProductStatus {
        CREATED,    // Product just registered by producer
        SHIPPED,    // Product in transit to distributor/retailer
        RECEIVED,   // Product received by distributor/retailer
        STORED,     // Product in storage
        DELIVERED   // Product delivered to consumer
    }
    
    // Types of verification that can be performed on products
    enum VerificationType {
        QUALITY_CHECK,        // Quality assessment by retailer
        REGULATORY_APPROVAL,   // Compliance check by regulator
        AUTHENTICITY,          // Authenticity verification by consumer
        COMPLIANCE             // General compliance verification
    }
    
    // Product struct stores all information about a registered product
    struct Product {
        uint256 id;              // Unique product identifier
        string name;             // Product name
        string batchId;          // Batch identifier for tracking
        address producer;        // Address of producer/manufacturer
        uint256 createdAt;       // Timestamp when product was registered
        string origin;           // Origin location/country
        string metadataHash;     // IPFS hash or off-chain storage reference for certificates
    }
    
    // Transfer struct records each ownership transfer
    struct Transfer {
        address from;            // Previous owner/custodian
        address to;              // New owner/custodian
        uint256 timestamp;       // When the transfer happened
        string shipmentDetails;  // Shipping info like tracking number, carrier
    }
    
    // Verification struct stores verification events
    struct Verification {
        address verifier;        // Who performed the verification
        uint256 timestamp;       // When verification happened
        VerificationType vType;  // Type of verification
        bool result;             // Pass or fail
        string notes;            // Additional notes about verification
    }
    
    // Reference to access control contract to check roles
    SafeBiteAccessRoles public accessControl;
    
    // Storage mappings
    mapping(uint256 => Product) private _products;                    // Product ID -> Product info
    mapping(uint256 => address) private _currentOwners;               // Product ID -> Current owner
    mapping(uint256 => ProductStatus) private _productStatuses;       // Product ID -> Current status
    mapping(uint256 => Transfer[]) private _transferHistory;          // Product ID -> Transfer history array
    mapping(uint256 => Verification[]) private _verificationHistory;  // Product ID -> Verification history array
    mapping(uint256 => bool) private _authenticityFlags;              // Product ID -> Is authentic flag
    
    // Counter for generating unique product IDs
    uint256 private _productCounter;
    
    // Events for tracking important state changes
    event ProductRegistered(
        uint256 indexed productId,
        address indexed producer,
        string name,
        string batchId
    );
    
    event OwnershipTransferred(
        uint256 indexed productId,
        address indexed from,
        address indexed to,
        string shipmentDetails
    );
    
    event StatusUpdated(
        uint256 indexed productId,
        ProductStatus oldStatus,
        ProductStatus newStatus,
        address indexed updatedBy
    );
    
    event ProductMetadataUpdated(
        uint256 indexed productId,
        string metadataHash
    );
    
    event ProductVerified(
        uint256 indexed productId,
        address indexed verifier,
        VerificationType vType,
        bool result
    );
    
    event AuthenticityConfirmed(
        uint256 indexed productId,
        address indexed verifier
    );
    
    event ComplianceChecked(
        uint256 indexed productId,
        address indexed regulator,
        bool compliant
    );
    
    // Modifier: Only addresses with PRODUCER role can call
    modifier onlyProducer() {
        require(
            accessControl.hasRole(msg.sender, SafeBiteAccessRoles.Role.PRODUCER),
            "SafeBiteSupplyChain: caller is not a producer"
        );
        _;
    }
    
    // Modifier: Only addresses with REGULATOR role can call
    modifier onlyRegulator() {
        require(
            accessControl.hasRole(msg.sender, SafeBiteAccessRoles.Role.REGULATOR),
            "SafeBiteSupplyChain: caller is not a regulator"
        );
        _;
    }
    
    // Modifier: Check if product exists (product ID is not zero)
    modifier productExists(uint256 productId) {
        require(_products[productId].id != 0, "SafeBiteSupplyChain: product does not exist");
        _;
    }
    
    // Modifier: Only current owner of the product can call
    modifier onlyOwner(uint256 productId) {
        require(
            _currentOwners[productId] == msg.sender,
            "SafeBiteSupplyChain: caller is not the product owner"
        );
        _;
    }
    
    // Constructor: Initialize with access control contract address
    // Sets up the connection to role management contract
    constructor(address _accessControl) {
        require(_accessControl != address(0), "SafeBiteSupplyChain: invalid access control address");
        accessControl = SafeBiteAccessRoles(_accessControl);
        _productCounter = 0;
    }
    
    // Register a new product on the blockchain
    // Only PRODUCER role can register products
    // Returns the unique product ID assigned to the product
    function registerProduct(
        string memory name,
        string memory batchId,
        string memory origin,
        string memory metadataHash
    ) external onlyProducer returns (uint256 productId) {
        // TODO: Implementation
        // - Validate input parameters (non-empty strings)
        // - Increment product counter
        // - Create Product struct
        // - Set producer as msg.sender
        // - Set status to CREATED
        // - Set current owner to producer
        // - Emit ProductRegistered event
        // - Return product ID
    }
    
    // Update product metadata (like certificates or quality reports)
    // Only current owner can update metadata
    function updateProductMetadata(
        uint256 productId,
        string memory newMetadataHash
    ) external productExists(productId) onlyOwner(productId) {
        // TODO: Implementation
        // - Validate new metadata hash is not empty
        // - Update metadata hash in Product struct
        // - Emit ProductMetadataUpdated event
    }
    
    // Get all information about a product by its ID
    // Returns all fields from the Product struct
    function getProduct(uint256 productId) external view productExists(productId) returns (
        string memory name,
        string memory batchId,
        address producer,
        uint256 createdAt,
        string memory origin,
        string memory metadataHash
    ) {
        // TODO: Implementation
        // - Return all fields from Product struct
    }
    
    // Get total number of products registered in the system
    function getProductCount() external view returns (uint256 count) {
        // TODO: Implementation
        // - Return product counter value
    }
    
    // Check if a product exists by checking if product ID is registered
    function productExists(uint256 productId) external view returns (bool exists) {
        // TODO: Implementation
        // - Return true if product ID is registered
    }
    
    // Transfer product ownership to another stakeholder
    // Only current owner can transfer
    // Updates product status based on recipient role (DISTRIBUTOR->SHIPPED, RETAILER->RECEIVED, CONSUMER->DELIVERED)
    function transferOwnership(
        uint256 productId,
        address to,
        string memory shipmentDetails
    ) external productExists(productId) onlyOwner(productId) {
        // TODO: Implementation
        // - Validate 'to' address is not zero and not current owner
        // - Validate recipient has appropriate role (DISTRIBUTOR, RETAILER, or CONSUMER)
        // - Create Transfer record
        // - Update current owner mapping
        // - Add transfer to history
        // - Update product status based on recipient role:
        //   - DISTRIBUTOR => SHIPPED
        //   - RETAILER => RECEIVED
        //   - CONSUMER => DELIVERED
        // - Emit OwnershipTransferred and StatusUpdated events
    }
    
    // Transfer multiple products to the same recipient in one transaction
    // Useful for batch operations
    function batchTransferOwnership(
        uint256[] memory productIds,
        address to,
        string memory shipmentDetails
    ) external {
        // TODO: Implementation
        // - Validate all products exist and belong to msg.sender
        // - Validate recipient address and role
        // - Transfer each product individually
        // - Emit events for each transfer
    }
    
    // Update product status (e.g., from RECEIVED to STORED)
    // Only current owner can update status
    // Should validate that status transition is valid (can't go backwards)
    function updateStatus(
        uint256 productId,
        ProductStatus newStatus
    ) external productExists(productId) onlyOwner(productId) {
        // TODO: Implementation
        // - Validate status transition is valid
        // - Store old status
        // - Update status mapping
        // - Emit StatusUpdated event
    }
    
    // Verify product authenticity (anyone can verify)
    // Checks if product hasn't been tampered with
    // Returns true if product is authentic
    function verifyAuthenticity(
        uint256 productId,
        string memory notes
    ) external productExists(productId) returns (bool isValid) {
        // TODO: Implementation
        // - Check product hasn't been tampered with
        // - Verify metadata hash integrity
        // - Create Verification record
        // - Set authenticity flag if valid
        // - Emit ProductVerified and AuthenticityConfirmed events
        // - Return verification result
    }
    
    // Perform quality check on product
    // Only RETAILER or REGULATOR can perform quality checks
    // Quality score should be 0-100
    function performQualityCheck(
        uint256 productId,
        uint8 qualityScore,
        string memory notes
    ) external productExists(productId) {
        // TODO: Implementation
        // - Validate caller has RETAILER or REGULATOR role
        // - Validate quality score is within range (0-100)
        // - Create Verification record with QUALITY_CHECK type
        // - Update product status if quality fails
        // - Emit ProductVerified event
    }
    
    // Check regulatory compliance
    // Only REGULATOR role can perform compliance checks
    // Stores certificate hash if product is compliant
    function checkCompliance(
        uint256 productId,
        bool compliant,
        string memory certificateHash
    ) external productExists(productId) onlyRegulator {
        // TODO: Implementation
        // - Create Verification record with REGULATORY_APPROVAL type
        // - Store certificate hash if compliant
        // - Emit ComplianceChecked and ProductVerified events
    }
    
    // Get current owner/custodian of a product
    function getCurrentOwner(uint256 productId) external view productExists(productId) returns (address owner) {
        // TODO: Implementation
        // - Return current owner address
    }
    
    // Get complete transfer history for a product
    // Returns array of all Transfer records showing ownership changes
    function getTransferHistory(uint256 productId) external view productExists(productId) returns (Transfer[] memory transfers) {
        // TODO: Implementation
        // - Return complete transfer history array
    }
    
    // Get current status of a product
    function getProductStatus(uint256 productId) external view productExists(productId) returns (ProductStatus status) {
        // TODO: Implementation
        // - Return current status enum value
    }
    
    // Get all verification records for a product
    // Shows quality checks, compliance checks, authenticity verifications
    function getVerificationHistory(uint256 productId) external view productExists(productId) returns (Verification[] memory verifications) {
        // TODO: Implementation
        // - Return all verification records
    }
    
    // Check if product has been verified as authentic
    function isProductAuthentic(uint256 productId) external view productExists(productId) returns (bool isAuthentic) {
        // TODO: Implementation
        // - Return authenticity flag
    }
    
    // Get product journey as readable strings
    // Combines registration, transfers, and status updates into a timeline
    // Returns array of strings describing each event in chronological order
    function getProductJourney(uint256 productId) external view productExists(productId) returns (string[] memory journey) {
        // TODO: Implementation
        // - Combine registration, transfers, and status updates
        // - Format as readable strings
        // - Return in chronological order
    }
    
    // Get complete provenance record
    // Combines all product data, transfers, status updates, and verifications
    // Returns as structured data (JSON-like string)
    // Note: Consider gas costs for large strings
    function getCompleteProvenance(uint256 productId) external view productExists(productId) returns (string memory provenance) {
        // TODO: Implementation
        // - Combine all product data, transfers, status updates, verifications
        // - Format as structured data
        // - Return comprehensive provenance record
    }
}
