/**
 * Role Routes
 * API endpoints for role management
 */

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Check role of an address
router.get('/check/:address', roleController.checkRole);

// Get current user's role
router.get('/my-role', roleController.getMyRole);

// Grant role to address (Admin only - for demo setup)
router.post('/grant', roleController.grantRole);

// Grant role using deployer account (Development only - automatically uses contract owner)
router.post('/grant-dev', roleController.grantRoleDev);

// Batch grant roles using deployer account (Development only)
router.post('/batch-grant-dev', roleController.batchGrantRoleDev);

module.exports = router;

