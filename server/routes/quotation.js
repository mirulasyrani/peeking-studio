const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const validate = require('../middleware/validate');

const quotationController = require('../controllers/quotationController');
const {
  createQuotationSchema,
  emailSchema,
  quotationIdParamSchema,
} = require('../validators/quotationSchema');

// ✅ Multer config to save PDFs under /uploads/quotations/:id/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const quotationId = req.params.id;
    if (!quotationId) return cb(new Error('Quotation ID missing in URL'));

    const folder = path.join(__dirname, '..', 'uploads', 'quotations', quotationId);
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `quotation-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* ROUTES */

// 👉 Create new quotation
router.post(
  '/',
  validate(createQuotationSchema),
  quotationController.createQuotation
);

// 👉 Get quotation by ID
router.get(
  '/:id',
  validate(quotationIdParamSchema, 'params'),
  quotationController.getQuotation
);

// 👉 Upload a PDF file for a specific quotation
router.post(
  '/:id/pdf',
  validate(quotationIdParamSchema, 'params'),
  upload.single('pdf'),
  quotationController.uploadPDF
);

// 👉 Send email with the most recent PDF from /uploads/quotations/:id/
router.post(
  '/:id/email',
  validate(quotationIdParamSchema, 'params'), // ✅ Added param check
  validate(emailSchema), // ✅ Optional: allow user-defined email body/subject
  async (req, res) => {
    const quotationId = req.params.id;
    const folder = path.join(__dirname, '..', 'uploads', 'quotations', quotationId);

    try {
      const files = fs.readdirSync(folder).filter(f => f.endsWith('.pdf'));
      if (!files.length) {
        return res.status(404).json({ error: 'No PDF file found to attach' });
      }

      // Use the most recently modified PDF
      const latestPdf = files.sort((a, b) =>
        fs.statSync(path.join(folder, b)).mtime - fs.statSync(path.join(folder, a)).mtime
      )[0];

      req.attachmentPath = path.join(folder, latestPdf);
      await quotationController.sendQuotationEmail(req, res);
    } catch (err) {
      console.error('📧 Email attachment error:', err);
      return res.status(500).json({ error: 'Failed to send email with PDF' });
    }
  }
);

module.exports = router;
