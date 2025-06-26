
require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors'); // ✨ Import the cors package ✨

const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Configure CORS using the 'cors' package ---
// Define your allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://peeking-studio.pages.dev'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // AND allow requests whose origin is in the allowedOrigins list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers in the request
  credentials: true // Allow cookies, authorization headers, etc. to be sent
}));

// --- Middleware ---
// Ensure CORS middleware is applied BEFORE any other route or body parser middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(morgan('dev')); // HTTP request logger

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
