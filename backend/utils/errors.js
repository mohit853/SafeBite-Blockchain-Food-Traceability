/**
 * Error Handling Utilities
 * Standardized error responses for API
 */

/**
 * Create standardized error response
 * 
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Formatted error response
 * 
 * TODO:
 * 1. Parse error message from blockchain transactions
 * 2. Extract user-friendly error messages
 * 3. Return formatted error object with status code
 */
function formatError(error, context = 'Unknown') {
  // TODO: Parse different error types
  // - Contract revert errors
  // - Network errors
  // - Validation errors
  // - Return { message, code, context }
  
  return {
    error: true,
    message: error.message || 'An error occurred',
    context: context,
    code: error.code || 'UNKNOWN_ERROR'
  };
}

/**
 * Handle contract transaction errors
 * 
 * @param {Error} error - Transaction error
 * @returns {Object} User-friendly error message
 * 
 * TODO:
 * 1. Parse common contract errors:
 *    - "caller is not a producer" -> "You don't have permission"
 *    - "product does not exist" -> "Product not found"
 *    - "insufficient funds" -> "Insufficient balance"
 * 2. Return user-friendly message
 */
function parseContractError(error) {
  // TODO: Parse error message
  // Extract meaningful error from contract revert
  // Return user-friendly message
}

module.exports = {
  formatError,
  parseContractError
};

