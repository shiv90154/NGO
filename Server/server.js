require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});