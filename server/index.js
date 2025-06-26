require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require("./routes/upload");
const galleryRoutes = require("./routes/galleryRoutes"); // cleaner import

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging requests

// --- API Routes ---
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// --- Serve static image files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Optional: Serve frontend build ---
// Uncomment this if you have a frontend build to serve from backend
// app.use(express.static(path.join(__dirname, 'client-dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client-dist', 'index.html'));
// });

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('✅ Photo Studio Backend API Running');
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// --- Start server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
