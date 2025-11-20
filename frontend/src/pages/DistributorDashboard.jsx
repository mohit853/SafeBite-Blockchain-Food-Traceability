/**
 * Distributor Dashboard
 * Dashboard for distributors to manage products in transit
 * 
 * TODO: Implement distributor dashboard
 * - List products owned by distributor
 * - Transfer products to retailer/consumer
 * - Update product status
 * - View shipment details
 */

import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useRole } from '../hooks/useRole';

export default function DistributorDashboard() {
  const { account, isConnected } = useWeb3();
  const { role } = useRole();
  const [products, setProducts] = useState([]);

  // TODO: Implement distributor dashboard
  return (
    <div>
      <h1>Distributor Dashboard</h1>
      <p>TODO: Implement distributor dashboard</p>
    </div>
  );
}

