/**
 * Producer Dashboard
 * Dashboard for producers to register and manage products
 * 
 * TODO: Implement producer dashboard
 * - Product registration form
 * - List of registered products
 * - Product details view
 * - QR code generation
 */

import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useRole } from '../hooks/useRole';
import ProductRegistration from '../components/Products/ProductRegistration';
import { productAPI } from '../services/api';

/**
 * ProducerDashboard Component
 * 
 * TODO:
 * 1. Check if user is producer, redirect if not
 * 2. Fetch list of products owned by producer
 * 3. Display product registration form
 * 4. Display list of products
 * 5. Show product details on click
 * 6. Generate QR codes for products
 * 7. Return dashboard layout
 */
export default function ProducerDashboard() {
  const { account, isConnected } = useWeb3();
  const { role, roleName } = useRole();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch products
  useEffect(() => {
    if (isConnected && role === 0) {
      // TODO: Fetch products owned by producer
    }
  }, [account, role]);

  // TODO: Check role and redirect if not producer
  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (role !== 0) {
    return <div>You must be a Producer to access this dashboard</div>;
  }

  return (
    <div>
      <h1>Producer Dashboard</h1>
      {/* TODO: Implement dashboard layout */}
      <ProductRegistration />
      {/* TODO: Product list */}
    </div>
  );
}

