// Main backend server file
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

// API Routes
const productRoutes = require('./routes/products');
const transferRoutes = require('./routes/transfers');
const verificationRoutes = require('./routes/verification');
const roleRoutes = require('./routes/roles');
const qrRoutes = require('./routes/qr');

app.use('/api/products', productRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/qr', qrRoutes);

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
