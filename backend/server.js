const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for all routes and origins
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from frontend
}));

// Middleware to parse JSON requests
app.use(express.json());

// Serve the uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', require('./routes/userRoutes'));
// Other routes
app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://0.0.0.0:27017/social_media_app';

// FIXED: Removed deprecated options
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));