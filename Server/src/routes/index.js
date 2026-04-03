// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import only the routes that actually exist
const userRoutes = require('./user.routes.js');

// Mount user routes
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Optional: root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Samraddh Bharat Foundation API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/api/health',
    },
  });
});

module.exports = router;