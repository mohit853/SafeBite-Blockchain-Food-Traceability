/**
 * Helper Utilities
 * Common utility functions
 */

/**
 * Format Ethereum address
 * Shows first 6 and last 4 characters
 * 
 * @param {string} address - Ethereum address
 * @returns {string} Formatted address
 * 
 * TODO:
 * 1. Check if address is valid
 * 2. Return formatted string like "0x1234...5678"
 */
export function formatAddress(address) {
  // TODO: Implement address formatting
  return address;
}

/**
 * Format timestamp to readable date
 * 
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 * 
 * TODO:
 * 1. Convert timestamp to Date object
 * 2. Format to readable string
 * 3. Return formatted date
 */
export function formatDate(timestamp) {
  // TODO: Implement date formatting
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Get role name from role number
 * 
 * @param {number} role - Role enum value
 * @returns {string} Role name
 */
export function getRoleName(role) {
  // TODO: Import ROLE_NAMES from constants
  // TODO: Return role name or 'Unknown'
  return 'Unknown';
}

/**
 * Get status name from status number
 * 
 * @param {number} status - Status enum value
 * @returns {string} Status name
 */
export function getStatusName(status) {
  // TODO: Import STATUS_NAMES from constants
  // TODO: Return status name or 'Unknown'
  return 'Unknown';
}

/**
 * Validate Ethereum address
 * 
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate product ID
 * 
 * @param {number} productId - Product ID
 * @returns {boolean} True if valid
 */
export function isValidProductId(productId) {
  return Number.isInteger(productId) && productId > 0;
}

