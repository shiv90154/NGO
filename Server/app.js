const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(helmet());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());


app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ================= ROUTES =================

// Auth
app.use('/api/auth', require('./routes/authRoutes'));

// Courses
app.use('/api/courses', require('./routes/courseRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'));

// Test protected route
const { protect } = require('./middleware/authMiddleware');

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

// ================= ERROR HANDLING =================

// 404 handler (IMPORTANT)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
const { errorHandler } = require('./utils/errorHandler');
app.use(errorHandler);

module.exports = app;