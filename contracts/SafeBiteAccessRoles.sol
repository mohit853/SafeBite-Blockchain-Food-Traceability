// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

// Access control contract for managing roles
// This contract handles role-based access control for all stakeholders in the supply chain
contract SafeBiteAccessRoles {
    
    // Enum defining all possible roles in the supply chain
    // Each role has different permissions in the main supply chain contract
    enum Role {
        PRODUCER,      // Manufacturers who create products
        DISTRIBUTOR,   // Entities that handle shipping and logistics
        RETAILER,      // Stores that receive and sell products
        REGULATOR,     // Authorities that perform compliance checks
        CONSUMER       // End users who can verify products (public access)
    }
    
    // Maps each address to its assigned role
    mapping(address => Role) private _roles;
    
    // Tracks if an address has been assigned any role
    // Used to distinguish between unregistered addresses and those with CONSUMER role
    mapping(address => bool) private _hasRole;
    
    // Contract owner who can grant and revoke roles
    address public owner;
    
    // Events for tracking role changes
    event RoleGranted(address indexed account, Role role);
    event RoleRevoked(address indexed account, Role role);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifier to restrict functions to contract owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "SafeBiteAccessRoles: caller is not the owner");
        _;
    }
    
    // Constructor sets the deployer as the initial owner
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    // Grant a role to an address
    // Only owner can grant roles, and CONSUMER role is public so it doesn't need to be granted
    function grantRole(address account, Role role) external onlyOwner {
        require(account != address(0), "SafeBiteAccessRoles: cannot grant role to zero address");
        require(role != Role.CONSUMER, "SafeBiteAccessRoles: CONSUMER role is public");
        
        // Store the role and mark address as having a role
        _roles[account] = role;
        _hasRole[account] = true;
        
        emit RoleGranted(account, role);
    }
    
    // Revoke a role from an address
    // Only owner can revoke, and we verify the account actually has that role before revoking
    function revokeRole(address account, Role role) external onlyOwner {
        require(_roles[account] == role, "SafeBiteAccessRoles: account does not have this role");
        
        // Delete the role and mark address as not having a role
        delete _roles[account];
        _hasRole[account] = false;
        
        emit RoleRevoked(account, role);
    }
    
    // Check if an address has a specific role
    // CONSUMER role returns true for everyone since it's public access
    function hasRole(address account, Role role) external view returns (bool) {
        if (role == Role.CONSUMER) {
            return true; // Consumer role is public - everyone has it
        }
        return _roles[account] == role;
    }
    
    // Get the role of an address
    // Returns CONSUMER as default if address hasn't been assigned a specific role
    function getRole(address account) external view returns (Role) {
        if (!_hasRole[account]) {
            return Role.CONSUMER; // Default to consumer for unregistered addresses
        }
        return _roles[account];
    }
    
    // Batch grant the same role to multiple addresses at once
    // Useful for initial setup when assigning roles to multiple stakeholders
    function batchGrantRole(address[] memory accounts, Role role) external onlyOwner {
        require(role != Role.CONSUMER, "SafeBiteAccessRoles: CONSUMER role is public");
        
        // Loop through all addresses and grant the role to each
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "SafeBiteAccessRoles: cannot grant role to zero address");
            _roles[accounts[i]] = role;
            _hasRole[accounts[i]] = true;
            emit RoleGranted(accounts[i], role);
        }
    }
    
    // Transfer ownership of the contract to a new address
    // Only current owner can transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "SafeBiteAccessRoles: new owner is zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
