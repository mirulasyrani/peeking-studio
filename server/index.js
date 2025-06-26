require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const path = require('path');

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

// --- API Routes ---
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);

// --- Serve static image files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Start server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
