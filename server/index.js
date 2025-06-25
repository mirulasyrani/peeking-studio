require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require("./routes/upload");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // <-- Add this line

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use("/api", uploadRoutes);
app.use("/uploads", express.static("uploads")); // to serve images
app.use("/api/gallery", require("./routes/galleryRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
