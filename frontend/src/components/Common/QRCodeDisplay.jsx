/**
 * QRCodeDisplay Component
 * Display QR code for a product
 * 
 * TODO: Implement QR code display
 * - Use qrcode.react library
 * - Fetch QR data from API or generate locally
 * - Show QR code image
 * - Allow download
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { qrAPI } from '../../services/api';

/**
 * QRCodeDisplay Component
 * 
 * @param {number} productId - Product ID
 * 
 * TODO:
 * 1. Fetch QR data from API or use productId directly
 * 2. Generate QR code using QRCodeSVG component
 * 3. Include product ID and verification URL in QR data
 * 4. Add download button
 * 5. Return QR code display
 */
export default function QRCodeDisplay({ productId }) {
  const [qrData, setQrData] = useState(null);

  // TODO: Fetch QR data
  useEffect(() => {
    // TODO: Fetch from API or generate locally
  }, [productId]);

  // TODO: Generate QR data object
  const generateQRData = () => {
    const baseUrl = window.location.origin;
    return {
      productId: productId,
      verifyUrl: `${baseUrl}/verify/${productId}`
    };
  };

  return (
    <div>
      {/* TODO: Implement QR code display */}
      {qrData && (
        <QRCodeSVG value={JSON.stringify(qrData)} />
      )}
    </div>
  );
}

