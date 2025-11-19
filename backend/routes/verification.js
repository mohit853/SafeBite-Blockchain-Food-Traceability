/**
 * Verification Routes
 * API endpoints for product verification operations
 */

const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Verify product authenticity
router.post('/authenticity', verificationController.verifyAuthenticity);

// Perform quality check
router.post('/quality', verificationController.performQualityCheck);

// Perform compliance check (Regulator only)
router.post('/compliance', verificationController.checkCompliance);

// Get verification history for a product
router.get('/:productId', verificationController.getVerificationHistory);

module.exports = router;

