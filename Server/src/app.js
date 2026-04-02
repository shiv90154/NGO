const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware'); // assumes both are exported

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
    res.send('API Running 🚀');
});

// API routes
app.use('/api', routes);

// ======================
// ERROR HANDLING (must be after routes)
// ======================
app.use(notFound);        // 404 handler
app.use(errorHandler);    // global error handler

module.exports = app;