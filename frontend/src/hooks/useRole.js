/**
 * useRole Hook
 * React hook for user role management
 * 
 * TODO: Implement role detection hook
 * - Get user role from contract
 * - Update role when account changes
 */

import { useState, useEffect } from 'react';
import contractService from '../services/contracts';
import { useWeb3 } from './useWeb3';

/**
 * Custom hook for user role
 * 
 * @returns {Object} Role state and methods
 * 
 * TODO:
 * 1. Get account from useWeb3 hook
 * 2. Create state for role and roleName
 * 3. Implement function to fetch role from contract
 * 4. Set up useEffect to fetch role when account changes
 * 5. Return { role, roleName, isLoading, refreshRole }
 */
export function useRole() {
  const { account } = useWeb3();
  const [role, setRole] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch role from contract
   * Sets loading state, calls contractService.getUserRole(),
   * maps role number to role name, and updates state.
   */
  const fetchRole = async () => {
    if (!account) {
      setRole(null);
      setRoleName(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const roleNumber = await contractService.getUserRole(account);
      const roleNames = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER', 'REGULATOR', 'CONSUMER'];
      const name = roleNames[roleNumber] || 'UNKNOWN';

      setRole(roleNumber);
      setRoleName(name);
    } catch (error) {
      console.error('Failed to fetch role:', error);
      setRole(null);
      setRoleName(null);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Set up useEffect to fetch role when account changes
  useEffect(() => {
    fetchRole();
  }, [account]);

  return {
    role,
    roleName,
    isLoading,
    refreshRole: fetchRole
  };
}

