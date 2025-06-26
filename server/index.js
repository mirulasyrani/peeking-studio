require('dotenv').config();
const express = require('express');
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

// ✅ Manual CORS Fix
const allowedOrigins = [
  'http://localhost:5173',
  'https://peeking-studio.pages.dev'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ✅ Short-circuit for OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --- API Routes ---
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);

// --- Static Uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('✅ Photo Studio Backend API Running');
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// --- Server ---
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
