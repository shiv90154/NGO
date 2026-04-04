// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware');

const app = express();

// CORS configuration (adjust for production)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API Running 🚀', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler
app.use(errorHandler);


module.exports = app;