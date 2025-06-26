require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Dynamic CORS config ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://peeking-studio.pages.dev',
  'https://peeking-studio-production.up.railway.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,Origin,Accept,X-Requested-With'
  );
  // efficient caching of preflight responses
  res.setHeader('Access-Control-Max-Age', '600');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Logging & JSON parsing
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check & fallback routes
app.get('/', (req, res) => res.send('✅ Photo Studio Backend API Running'));
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
