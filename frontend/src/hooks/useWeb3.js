/**
 * useWeb3 Hook
 * React hook for Web3 connection state
 * 
 * TODO: Implement Web3 connection hook
 * - Manage connection state
 * - Handle connect/disconnect
 * - Listen for account/network changes
 */

import { useState, useEffect } from 'react';
import web3Service from '../services/web3';

/**
 * Custom hook for Web3 connection
 * 
 * @returns {Object} Web3 connection state and methods
 * 
 * TODO:
 * 1. Create state for account, isConnected, isLoading
 * 2. Implement connect function that calls web3Service.connectWallet()
 * 3. Implement disconnect function
 * 4. Set up useEffect to check if already connected on mount
 * 5. Set up listeners for account and network changes
 * 6. Return { account, isConnected, isLoading, connect, disconnect }
 */
export function useWeb3() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Connect to MetaMask wallet
   * Sets loading state, calls web3Service.connectWallet(), and updates state.
   */
  const connect = async () => {
    setIsLoading(true);
    try {
      const account = await web3Service.connectWallet();
      setAccount(account);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setAccount(null);
      setIsConnected(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Disconnect wallet
   * Calls web3Service.disconnectWallet() and resets state.
   */
  const disconnect = () => {
    web3Service.disconnectWallet();
    setAccount(null);
    setIsConnected(false);
  };

  /**
   * Set up useEffect for initial connection check and listeners
   * Checks if already connected on mount and sets up account/network change listeners.
   */
  useEffect(() => {
    let accountCleanup = null;
    let chainCleanup = null;

    // Check if already connected
    const checkConnection = async () => {
      const isConnected = await web3Service.checkConnection();
      if (isConnected) {
        setAccount(web3Service.getAccount());
        setIsConnected(true);
      }
    };

    checkConnection();

    // Set up account change listener
    accountCleanup = web3Service.onAccountsChanged((newAccount) => {
      if (newAccount) {
        setAccount(newAccount);
        setIsConnected(true);
      } else {
        setAccount(null);
        setIsConnected(false);
      }
    });

    // Set up network change listener
    chainCleanup = web3Service.onChainChanged((chainId) => {
      // Reload page on network change (recommended by MetaMask)
      window.location.reload();
    });

    // Cleanup listeners on unmount
    return () => {
      if (accountCleanup) accountCleanup();
      if (chainCleanup) chainCleanup();
    };
  }, []);

  return {
    account,
    isConnected,
    isLoading,
    connect,
    disconnect
  };
}

