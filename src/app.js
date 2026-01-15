const express = require('express');
const cors = require('cors');
const cryptoRoutes = require('./routes/crypto');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/crypto', cryptoRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Crypto API is running', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
