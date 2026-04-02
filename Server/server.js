// server.js (or index.js)
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config');

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in environment variables');
  process.exit(1);
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ Email credentials missing – OTP emails will fail');
}

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB(); // assuming connectDB returns a Promise
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔴 Shutting down gracefully...');
  // If you have a disconnectDB function, call it here
  process.exit(0);
});