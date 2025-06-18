require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000; 

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 

// Test route
app.get('/', (req, res) => {
    res.send('Chronos Terminal Backend is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
