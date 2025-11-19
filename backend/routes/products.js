/**
 * Product Routes
 * API endpoints for product operations
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Register a new product
router.post('/register', productController.registerProduct);

// List products (with optional filters) - MUST come before /:id routes
router.get('/', productController.listProducts);

// Get product journey
router.get('/:id/journey', productController.getProductJourney);

// Get complete product provenance
router.get('/:id/provenance', productController.getProductProvenance);

// Get product information - MUST come last (catches all other /:id routes)
router.get('/:id', productController.getProduct);

module.exports = router;

