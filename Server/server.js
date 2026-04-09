// server.js (or index.js)
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db'); // adjust path if needed

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnv = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length) {
  console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
  if (missingEnv.includes('JWT_SECRET')) {
    console.error('   JWT_SECRET is critical. Server will not start.');
    process.exit(1);
  } else {
    console.warn('   ⚠️ Email credentials missing – OTP emails will fail. Continue anyway?');
    // Continue without exiting for email only
  }
}

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown (SIGINT, SIGTERM)
const shutdown = async (signal) => {
  console.log(`\n🔴 ${signal} received. Shutting down gracefully...`);
  // If you have a disconnectDB function, call it here
  // await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Optionally perform cleanup before exiting
  process.exit(1);
});