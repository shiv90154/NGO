// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware');

const app = express();

// CORS configuration (adjust allowed origins for production)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Body parsing with size limits (increase if needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Optional: serve temp_uploads for debugging (don't expose in production)
// const tempDir = path.join(__dirname, '../temp_uploads');
// if (fs.existsSync(tempDir)) app.use('/temp_uploads', express.static(tempDir));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Samraddh Bharat API Running 🚀', 
    timestamp: new Date().toISOString() 
  });
});

// API routes (mount all routes under /api)
app.use('/api', routes);

// 404 handler – must be after all route definitions
app.use(notFound);

// Global error handler – catches any unhandled errors
app.use(errorHandler);

module.exports = app;