/**
 * QR Code Service
 * Generates QR codes for products containing product ID and verification URL
 * 
 * TODO: Implement QR code generation
 * - Generate QR code with product ID
 * - Include verification URL in QR data
 * - Return QR code as image buffer or data URL
 */

const QRCode = require('qrcode');

class QRService {
  /**
   * Generate QR code data for a product
   * 
   * @param {number} productId - Product ID
   * @param {string} baseUrl - Base URL for verification (e.g., http://localhost:5173)
   * @returns {Promise<string>} QR code data URL or JSON string
   * 
   * TODO:
   * 1. Create QR data object with productId and verification URL
   * 2. Convert to JSON string
   * 3. Generate QR code image using QRCode.toDataURL()
   * 4. Return data URL or buffer
   */
  async generateQRCode(productId, baseUrl = 'http://localhost:5173') {
    // TODO: Create QR data object
    // Format: { productId: 123, verifyUrl: "http://localhost:5173/verify/123" }
    
    // TODO: Generate QR code image
    // Use QRCode.toDataURL() to generate image
    // Return data URL string
  }

  /**
   * Generate QR code as image buffer
   * 
   * @param {number} productId - Product ID
   * @param {string} baseUrl - Base URL for verification
   * @returns {Promise<Buffer>} QR code image buffer
   * 
   * TODO:
   * 1. Generate QR code using QRCode.toBuffer()
   * 2. Return buffer for direct image response
   */
  async generateQRCodeBuffer(productId, baseUrl = 'http://localhost:5173') {
    // TODO: Generate QR code buffer
    // Use QRCode.toBuffer()
    // Return buffer
  }

  /**
   * Get QR code data as JSON (for frontend to generate QR)
   * 
   * @param {number} productId - Product ID
   * @param {string} baseUrl - Base URL for verification
   * @returns {Object} QR code data object
   * 
   * TODO:
   * 1. Return JSON object with productId and verifyUrl
   * 2. Frontend can use this to generate QR code
   */
  getQRCodeData(productId, baseUrl = 'http://localhost:5173') {
    // TODO: Return JSON object
    // { productId, verifyUrl: `${baseUrl}/verify/${productId}` }
  }
}

module.exports = new QRService();

