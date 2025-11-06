/**
 * @file Main backend server file
 * @notice Express server for SafeBite API endpoints
 * @dev Basic server setup - routes and controllers to be implemented
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SafeBite API is running' });
});

// TODO: Add API routes
// - Product routes: /api/products
// - Transfer routes: /api/transfers
// - Verification routes: /api/verification
// - Auth routes: /api/auth

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SafeBite Backend API running on port ${PORT}`);
});

module.exports = app;
