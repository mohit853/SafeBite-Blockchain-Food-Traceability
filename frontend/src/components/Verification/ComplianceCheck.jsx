/**
 * Compliance Check Component
 * Component for regulators to perform compliance checks on products
 * 
 * Allows regulators to:
 * - Mark products as compliant or non-compliant
 * - Add certificate hash for compliant products
 * - Submit compliance verification to blockchain
 */

import { useState } from 'react';
import { verificationAPI } from '../../services/api';
import './ComplianceCheck.css';

/**
 * ComplianceCheck Component
 * 
 * @param {number} productId - Product ID to check compliance for
 * @param {string} signerAddress - Regulator address performing the check
 * @param {function} onComplianceCheckComplete - Callback when check is complete
 */
export default function ComplianceCheck({ productId, signerAddress, onComplianceCheckComplete }) {
  const [compliant, setCompliant] = useState(true);
  const [certificateHash, setCertificateHash] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Handle form submission
   * Submits compliance check to backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await verificationAPI.checkCompliance({
        signerAddress,
        productId,
        compliant,
        certificateHash: certificateHash.trim()
      });

      if (response.data && response.data.success) {
        let successMessage = `Product marked as ${compliant ? 'compliant' : 'non-compliant'}!`;
        
        // Check if authenticity was auto-verified
        if (response.data.autoVerified && response.data.isAuthentic) {
          successMessage += ' ✓ Product authenticity automatically verified!';
        }
        
        setSuccess(successMessage);
        
        // Reset form
        setCompliant(true);
        setCertificateHash('');
        setNotes('');
        
        // Call callback
        if (onComplianceCheckComplete) {
          onComplianceCheckComplete(productId, compliant);
        }
      } else {
        setError(response.data?.message || 'Compliance check failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to perform compliance check');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="compliance-check">
      <h3>Perform Compliance Check</h3>
      <form onSubmit={handleSubmit} className="compliance-check-form">
        <div className="form-group">
          <label htmlFor="compliant">
            Compliance Status
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="compliant"
                value="true"
                checked={compliant === true}
                onChange={() => setCompliant(true)}
              />
              <span className={`radio-option ${compliant ? 'selected' : ''}`}>
                ✓ Compliant
              </span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="compliant"
                value="false"
                checked={compliant === false}
                onChange={() => setCompliant(false)}
              />
              <span className={`radio-option ${!compliant ? 'selected' : ''}`}>
                ✗ Non-Compliant
              </span>
            </label>
          </div>
        </div>

        {compliant && (
          <div className="form-group">
            <label htmlFor="certificateHash">
              Certificate Hash (Optional)
            </label>
            <input
              type="text"
              id="certificateHash"
              value={certificateHash}
              onChange={(e) => setCertificateHash(e.target.value)}
              placeholder="Enter certificate hash if available"
              className="form-input"
            />
            <small className="form-help">
              Add a certificate hash for compliant products (e.g., from regulatory database)
            </small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about the compliance check..."
            rows="4"
            className="form-textarea"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-submit ${compliant ? 'btn-compliant' : 'btn-non-compliant'}`}
          >
            {isSubmitting ? 'Submitting...' : `Mark as ${compliant ? 'Compliant' : 'Non-Compliant'}`}
          </button>
        </div>
      </form>
    </div>
  );
}

