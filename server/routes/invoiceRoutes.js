const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { z } = require('zod');
const validate = require('../middleware/validate');
const {
  createInvoice,
  getInvoiceById,
  confirmInvoicePayment,
  uploadInvoicePDF,
  sendInvoiceEmail
} = require('../controllers/invoiceController');

const router = express.Router();

// ✅ Param validation
const invoiceIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invoice ID must be numeric'),
});

// ✅ Multer storage config for saving PDF in /uploads/invoices/{id}/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const invoiceId = req.params.id;
    const folderPath = path.join(__dirname, '..', 'uploads', 'invoices', invoiceId);
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'invoice.pdf'); // Always save as invoice.pdf
  }
});

const upload = multer({ storage });

// ✅ Routes
router.post(
  '/',
  validate(require('../validators/invoiceSchema')),
  createInvoice
);

router.get(
  '/:id',
  validate(invoiceIdParamSchema, 'params'),
  getInvoiceById
);

router.patch(
  '/:id/confirm',
  validate(invoiceIdParamSchema, 'params'),
  confirmInvoicePayment
);

// ✅ Upload invoice PDF
router.post(
  '/:id/pdf',
  validate(invoiceIdParamSchema, 'params'),
  upload.single('pdf'),
  uploadInvoicePDF
);

// ✅ Email invoice with PDF attached
router.post(
  '/:id/email',
  validate(invoiceIdParamSchema, 'params'),
  sendInvoiceEmail
);

module.exports = router;
