// ✅ routes/quotation.js
const express = require('express');
const router = express.Router();

// Import controller
const quotationController = require('../controllers/quotationController');

// Import multer for file upload
const multer = require('multer');
const path = require('path');

// Set up file storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `quotation-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 👉 Create a new quotation
router.post('/', quotationController.createQuotation);

// 👉 Get a quotation by ID
router.get('/:id', quotationController.getQuotation);

// 👉 Upload quotation PDF
router.post('/:id/pdf', upload.single('pdf'), quotationController.uploadPDF);

// 👉 Send quotation via email
router.post('/:id/email', quotationController.sendQuotationEmail);

module.exports = router;
