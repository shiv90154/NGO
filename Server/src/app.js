const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware');

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// STATIC FOLDER (uploads)
// ======================
app.use('/uploads', express.static('uploads'));

// ======================
// ROUTES
// ======================
app.get('/', (req, res) => {
    res.send('API Running 🚀');
});

app.use('/api', routes);

// ======================
// ERROR HANDLING
// ======================
app.use(notFound);
app.use(errorHandler);

module.exports = app;