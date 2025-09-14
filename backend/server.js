require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');
const {errorHandler} = require('./middleware/response');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantsRoutes);

// centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_notes';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log('Server started on port', PORT));
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
