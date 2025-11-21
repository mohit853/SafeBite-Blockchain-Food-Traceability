/**
 * Role Controller
 * Handles role-related operations
 */

const contractService = require('../services/contractService');
const { formatError } = require('../utils/errors');
const { isValidAddress, getDeployerAddress } = require('../utils/helpers');

/**
 * Check user role
 * GET /api/roles/check/:address
 * 
 * Validates address, calls contractService.getUserRole(),
 * maps role number to role name, and returns role info.
 */
async function checkRole(req, res) {
  try {
    const address = req.params.address;
    
    // Validate address
    if (!isValidAddress(address)) {
      return res.status(400).json(formatError(new Error('Invalid address'), 'checkRole'));
    }
    
    // Call contractService.getUserRole()
    const role = await contractService.getUserRole(address);
    
    // Map role number to role name
    const roleNames = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER', 'REGULATOR', 'CONSUMER'];
    const roleName = roleNames[role] || 'UNKNOWN';
    
    // Return role info
    res.json({
      success: true,
      address: address,
      role: role,
      roleName: roleName
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'checkRole'));
  }
}

/**
 * Get current user's role (from wallet address in query)
 * GET /api/roles/my-role?address=0x...
 * 
 * Gets address from query params, validates it, calls contractService.getUserRole(),
 * maps role number to role name, and returns role.
 */
async function getMyRole(req, res) {
  try {
    const address = req.query.address;
    
    // Validate address
    if (!address || !isValidAddress(address)) {
      return res.status(400).json(formatError(new Error('Invalid address'), 'getMyRole'));
    }
    
    // Call contractService.getUserRole()
    const role = await contractService.getUserRole(address);
    
    // Map role number to role name
    const roleNames = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER', 'REGULATOR', 'CONSUMER'];
    const roleName = roleNames[role] || 'UNKNOWN';
    
    // Return role
    res.json({
      success: true,
      role: role,
      roleName: roleName
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'getMyRole'));
  }
}

/**
 * Grant role to address (Admin only - for demo setup)
 * POST /api/roles/grant
 * 
 * Body: { signerAddress, accountAddress, role }
 * 
 * Validates inputs, calls contractService.grantRole() (contract enforces owner check),
 * and returns transaction hash.
 */
async function grantRole(req, res) {
  try {
    const { signerAddress, accountAddress, role } = req.body;
    
    // Validate inputs
    if (!signerAddress || !isValidAddress(signerAddress)) {
      return res.status(400).json(formatError(new Error('Invalid signer address'), 'grantRole'));
    }
    if (!accountAddress || !isValidAddress(accountAddress)) {
      return res.status(400).json(formatError(new Error('Invalid account address'), 'grantRole'));
    }
    if (typeof role !== 'number' || role < 0 || role > 4) {
      return res.status(400).json(formatError(new Error('Invalid role (must be 0-4)'), 'grantRole'));
    }
    if (role === 4) {
      return res.status(400).json(formatError(new Error('CONSUMER role is public and does not need to be granted'), 'grantRole'));
    }
    
    // Call contractService.grantRole() (contract enforces owner check)
    const result = await contractService.grantRole(signerAddress, accountAddress, role);
    
    // Return transaction hash
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      message: `Role granted successfully`
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'grantRole'));
  }
}

/**
 * Grant role to address using deployer account (Development only)
 * POST /api/roles/grant-dev
 * 
 * Body: { accountAddress, role }
 * 
 * Automatically uses the deployer account from deployment file as signer.
 * This is a convenience endpoint for development/testing with Hardhat accounts.
 * No need to provide signerAddress - it uses the contract owner automatically.
 */
async function grantRoleDev(req, res) {
  try {
    const { accountAddress, role } = req.body;
    
    // Validate inputs
    if (!accountAddress || !isValidAddress(accountAddress)) {
      return res.status(400).json(formatError(new Error('Invalid account address'), 'grantRoleDev'));
    }
    if (typeof role !== 'number' || role < 0 || role > 4) {
      return res.status(400).json(formatError(new Error('Invalid role (must be 0-4)'), 'grantRoleDev'));
    }
    if (role === 4) {
      return res.status(400).json(formatError(new Error('CONSUMER role is public and does not need to be granted'), 'grantRoleDev'));
    }
    
    // Get deployer address from deployment file
    let deployerAddress;
    try {
      deployerAddress = getDeployerAddress();
    } catch (error) {
      return res.status(500).json(formatError(new Error(`Failed to get deployer address: ${error.message}`), 'grantRoleDev'));
    }
    
    // Call contractService.grantRole() using deployer as signer
    const result = await contractService.grantRole(deployerAddress, accountAddress, role);
    
    // Map role number to role name
    const roleNames = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER', 'REGULATOR', 'CONSUMER'];
    const roleName = roleNames[role] || 'UNKNOWN';
    
    // Return transaction hash
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      deployerAddress: deployerAddress,
      accountAddress: accountAddress,
      role: role,
      roleName: roleName,
      message: `${roleName} role granted successfully to ${accountAddress}`
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'grantRoleDev'));
  }
}

/**
 * Batch grant roles to multiple addresses (Development only)
 * POST /api/roles/batch-grant-dev
 * 
 * Body: { assignments: [{ accountAddress, role }, ...] }
 * 
 * Automatically uses the deployer account from deployment file as signer.
 * Grants multiple roles in a single request for convenience.
 */
async function batchGrantRoleDev(req, res) {
  try {
    const { assignments } = req.body;
    
    // Validate inputs
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json(formatError(new Error('assignments must be a non-empty array'), 'batchGrantRoleDev'));
    }
    
    // Validate each assignment
    for (const assignment of assignments) {
      if (!assignment.accountAddress || !isValidAddress(assignment.accountAddress)) {
        return res.status(400).json(formatError(new Error(`Invalid account address: ${assignment.accountAddress}`), 'batchGrantRoleDev'));
      }
      if (typeof assignment.role !== 'number' || assignment.role < 0 || assignment.role > 4) {
        return res.status(400).json(formatError(new Error(`Invalid role for ${assignment.accountAddress}: must be 0-4`), 'batchGrantRoleDev'));
      }
      if (assignment.role === 4) {
        return res.status(400).json(formatError(new Error('CONSUMER role is public and does not need to be granted'), 'batchGrantRoleDev'));
      }
    }
    
    // Get deployer address from deployment file
    let deployerAddress;
    try {
      deployerAddress = getDeployerAddress();
    } catch (error) {
      return res.status(500).json(formatError(new Error(`Failed to get deployer address: ${error.message}`), 'batchGrantRoleDev'));
    }
    
    // Grant roles one by one (contract doesn't have batch grant in service yet, but we can add it)
    const roleNames = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER', 'REGULATOR', 'CONSUMER'];
    const results = [];
    const errors = [];
    
    for (const assignment of assignments) {
      try {
        const result = await contractService.grantRole(deployerAddress, assignment.accountAddress, assignment.role);
        results.push({
          accountAddress: assignment.accountAddress,
          role: assignment.role,
          roleName: roleNames[assignment.role],
          transactionHash: result.transactionHash,
          success: true
        });
      } catch (error) {
        errors.push({
          accountAddress: assignment.accountAddress,
          role: assignment.role,
          error: error.message,
          success: false
        });
      }
    }
    
    // Return results
    res.json({
      success: true,
      deployerAddress: deployerAddress,
      total: assignments.length,
      successful: results.length,
      failed: errors.length,
      results: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Granted ${results.length} out of ${assignments.length} roles successfully`
    });
  } catch (error) {
    res.status(500).json(formatError(error, 'batchGrantRoleDev'));
  }
}

module.exports = {
  checkRole,
  getMyRole,
  grantRole,
  grantRoleDev,
  batchGrantRoleDev
};

