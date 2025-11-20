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

  // TODO: Implement connect function
  const connect = async () => {
    // TODO: Set loading, call web3Service, update state
  };

  // TODO: Implement disconnect function
  const disconnect = () => {
    // TODO: Call web3Service.disconnect, reset state
  };

  // TODO: Set up useEffect for initial connection check
  useEffect(() => {
    // TODO: Check if already connected
    // TODO: Set up account/network change listeners
  }, []);

  return {
    account,
    isConnected,
    isLoading,
    connect,
    disconnect
  };
}

