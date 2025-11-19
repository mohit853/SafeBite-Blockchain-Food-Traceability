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

module.exports = router;

