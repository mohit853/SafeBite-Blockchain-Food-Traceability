/**
 * Transfer Routes
 * API endpoints for ownership transfer operations
 */

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

// Transfer product ownership
router.post('/', transferController.transferOwnership);

// Batch transfer multiple products
router.post('/batch', transferController.batchTransferOwnership);

// Get transfer history for a product
router.get('/:productId', transferController.getTransferHistory);

module.exports = router;

