const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const cultivationRoutes = require('./routes/cultivationRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/cultivation', cultivationRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Coffee Farm API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Database: ${process.env.DB_NAME}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});