// src/routes/index.js
const express = require('express');
const router = express.Router();

// User routes (authentication, profile, etc.)
const userRoutes = require('./auth.routes');

// Education routes (courses, tests, certificates, etc.)
const educationRoutes = require('./educationRoutes');   // <-- import education routes

// ======================
// HEALTH CHECK
// ======================
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// ======================
// ROOT API INFO
// ======================
router.get('/', (req, res) => {
  res.json({
    name: 'Samraddh Bharat Foundation API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      education: '/api/education',
    },
  });
});

// ======================
// MOUNT ROUTES
// ======================
router.use('/users', userRoutes);
router.use('/education', educationRoutes);   // <-- mount education routes

module.exports = router;