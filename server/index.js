require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// --- Route Imports ---
const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

// --- CORS Configuration ---
// Allowlist the frontend domain
const allowedOrigins = [
  'http://localhost:5173',
  'https://peeking-studio.pages.dev'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

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

// --- Serve Static Uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Root Test Route ---
app.get('/', (req, res) => {
  res.send('✅ Photo Studio Backend API Running');
});

// --- 404 Fallback ---
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
