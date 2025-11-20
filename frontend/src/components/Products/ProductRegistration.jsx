/**
 * ProductRegistration Component
 * Form to register a new product (Producer only)
 * 
 * TODO: Implement product registration form
 * - Form fields: name, batchId, origin, metadataHash (optional)
 * - Validation
 * - Submit handler that calls contract
 * - Show transaction status
 * - Generate QR code after registration
 */

import { useState } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useRole } from '../../hooks/useRole';
import contractService from '../../services/contracts';
import { productAPI } from '../../services/api';

/**
 * ProductRegistration Component
 * 
 * TODO:
 * 1. Create form state for name, batchId, origin, metadataHash
 * 2. Add form validation
 * 3. Implement submit handler:
 *    - Call contractService.registerProduct()
 *    - Show loading state
 *    - Handle success/error
 *    - Generate QR code after success
 * 4. Check if user has PRODUCER role
 * 5. Show error if not producer
 * 6. Return form JSX
 */
export default function ProductRegistration() {
  const { account, isConnected } = useWeb3();
  const { role } = useRole();
  const [formData, setFormData] = useState({
    name: '',
    batchId: '',
    origin: '',
    metadataHash: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // TODO: Implement form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Validate form
    // TODO: Call contract to register product
    // TODO: Handle response
  };

  // TODO: Check if user is producer
  if (!isConnected || role !== 0) {
    return <div>You must be a Producer to register products</div>;
  }

  return (
    <div>
      {/* TODO: Implement form */}
      <p>ProductRegistration component - TODO: Implement</p>
    </div>
  );
}

