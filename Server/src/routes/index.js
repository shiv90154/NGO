// src/routes/index.js
const express = require('express');
const router = express.Router();

// Existing routes
const userRoutes = require('./user.routes.js');
const studentRoutes = require("./student.routes");

// Module routes
const educationRoutes = require('./educationRoutes');
const agricultureRoutes = require("./agricultureRoutes.js");

// Mount routes
router.use("/students", studentRoutes);
router.use('/users', userRoutes);
router.use('/education', educationRoutes);
router.use('/agriculture', agricultureRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Samraddh Bharat Foundation API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      students: '/api/students',
      education: '/api/education',
      health: '/api/health',
    },
  });
});

module.exports = router;