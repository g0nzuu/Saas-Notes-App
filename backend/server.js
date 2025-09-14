require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');
const { errorHandler } = require('./middleware/response');

const app = express();

// ✅ Allow all origins temporarily (for debugging CORS)
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantsRoutes);

// Centralized error handler
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_notes';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ❌ No app.listen() here
// ✅ Instead, export the app for Vercel
module.exports = app;
