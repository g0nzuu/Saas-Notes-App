require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');
const { errorHandler } = require('./middleware/response');

const app = express();

// ✅ Configure CORS to allow your frontend domain
const corsOptions = {
  origin: [
    "https://saas-notes-app-frontend-ivory.vercel.app/", // replace with your actual frontend URL
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// ✅ Health check endpoint
app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantsRoutes);

// ✅ Centralized error handler
app.use(errorHandler);

// ✅ Connect to MongoDB once (before handling requests)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_notes';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ❌ Do not call app.listen() here (Vercel handles it)
// ✅ Export the app for Vercel serverless functions
module.exports = app;
