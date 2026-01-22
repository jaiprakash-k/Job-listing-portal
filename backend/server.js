const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Reload envs

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobconnect';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB at', MONGODB_URI))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes (Placeholders for now)
app.get('/', (req, res) => {
    res.send('JobConnect API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const companyRoutes = require('./routes/companies');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
