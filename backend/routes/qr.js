/**
 * QR Code Routes
 * API endpoints for QR code generation
 */

const express = require('express');
const router = express.Router();
const qrService = require('../services/qrService');
const { isValidProductId } = require('../utils/helpers');

/**
 * Generate QR code image
 * GET /api/qr/:productId
 * 
 * Returns QR code as image (PNG)
 * 
 * Validates product ID, gets base URL from environment or request,
 * generates QR code buffer, and returns image with proper content-type.
 */
router.get('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const baseUrl = req.query.baseUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Validate productId
    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    // Generate QR code buffer
    const buffer = await qrService.generateQRCodeBuffer(productId, baseUrl);
    
    // Set content-type to image/png
    res.setHeader('Content-Type', 'image/png');
    
    // Send buffer as response
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get QR code data (JSON)
 * GET /api/qr/:productId/data
 * 
 * Returns QR code data as JSON (frontend can generate QR from this)
 * 
 * Validates product ID, gets QR code data object from qrService, and returns JSON.
 */
router.get('/:productId/data', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const baseUrl = req.query.baseUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Validate productId
    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    // Get QR code data from qrService
    const data = qrService.getQRCodeData(productId, baseUrl);
    
    // Return JSON
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

