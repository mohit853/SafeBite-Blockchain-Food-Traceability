/**
 * Web3 Service
 * Handles MetaMask connection and Web3 provider setup
 * 
 * TODO: Implement MetaMask connection
 * - Check if MetaMask is installed
 * - Request account access
 * - Switch to localhost network if needed
 * - Handle network changes
 * - Handle account changes
 */

import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.isConnected = false;
  }

  /**
   * Check if MetaMask is installed
   * 
   * @returns {boolean} True if MetaMask is available
   * 
   * TODO:
   * 1. Check if window.ethereum exists
   * 2. Return boolean
   */
  isMetaMaskInstalled() {
    // TODO: Check window.ethereum
    return false;
  }

  /**
   * Connect to MetaMask wallet
   * 
   * @returns {Promise<string>} Connected account address
   * 
   * TODO:
   * 1. Check if MetaMask is installed, throw error if not
   * 2. Request account access using window.ethereum.request()
   * 3. Create provider using new ethers.BrowserProvider(window.ethereum)
   * 4. Get signer from provider
   * 5. Get account address
   * 6. Store provider, signer, and account
   * 7. Set isConnected to true
   * 8. Return account address
   */
  async connectWallet() {
    // TODO: Implement MetaMask connection
    throw new Error('Not implemented');
  }

  /**
   * Disconnect wallet
   * 
   * TODO:
   * 1. Reset provider, signer, account to null
   * 2. Set isConnected to false
   */
  disconnectWallet() {
    // TODO: Reset all connection state
  }

  /**
   * Get current connected account
   * 
   * @returns {string|null} Account address or null
   */
  getAccount() {
    return this.account;
  }

  /**
   * Get provider instance
   * 
   * @returns {ethers.Provider|null} Provider or null
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Get signer instance
   * 
   * @returns {ethers.Signer|null} Signer or null
   */
  getSigner() {
    return this.signer;
  }

  /**
   * Switch to localhost network
   * 
   * @returns {Promise<void>}
   * 
   * TODO:
   * 1. Check if already on localhost (chainId 1337)
   * 2. If not, request network switch using window.ethereum.request()
   * 3. Add network if it doesn't exist
   * 4. Handle errors
   */
  async switchToLocalhost() {
    // TODO: Implement network switching
  }

  /**
   * Listen for account changes
   * 
   * @param {Function} callback - Callback function when account changes
   * 
   * TODO:
   * 1. Listen to window.ethereum.on('accountsChanged')
   * 2. Call callback with new accounts
   * 3. Update internal state
   */
  onAccountsChanged(callback) {
    // TODO: Implement account change listener
  }

  /**
   * Listen for network changes
   * 
   * @param {Function} callback - Callback function when network changes
   * 
   * TODO:
   * 1. Listen to window.ethereum.on('chainChanged')
   * 2. Call callback with new chainId
   * 3. Reload page or update state
   */
  onChainChanged(callback) {
    // TODO: Implement chain change listener
  }
}

export default new Web3Service();

