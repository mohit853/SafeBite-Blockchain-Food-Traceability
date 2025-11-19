/**
 * Helper Utilities
 * Common utility functions for backend
 */

const fs = require('fs');
const path = require('path');

/**
 * Load contract addresses from deployment file
 * 
 * @returns {Object} Contract addresses
 * 
 * TODO:
 * 1. Read deployments/local.json
 * 2. Extract contract addresses
 * 3. Return { accessControl, supplyChain }
 */
function loadContractAddresses() {
  // TODO: Read from deployments/local.json
  // Return contract addresses
}

/**
 * Load contract ABI from artifacts
 * 
 * @param {string} contractName - Name of contract (e.g., "SafeBiteSupplyChain")
 * @returns {Object} Contract ABI
 * 
 * TODO:
 * 1. Read ABI from artifacts/contracts/{contractName}.sol/{contractName}.json
 * 2. Parse and return ABI
 */
function loadContractABI(contractName) {
  // TODO: Load ABI from artifacts folder
  // Return ABI object
}

/**
 * Validate Ethereum address
 * 
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid address
 */
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate product ID
 * 
 * @param {number} productId - Product ID
 * @returns {boolean} True if valid product ID
 */
function isValidProductId(productId) {
  return Number.isInteger(productId) && productId > 0;
}

module.exports = {
  loadContractAddresses,
  loadContractABI,
  isValidAddress,
  isValidProductId
};

