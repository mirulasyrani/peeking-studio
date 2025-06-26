const quotationModel = require('../models/quotation');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/mailer');

// ✅ Create Quotation
exports.createQuotation = async (req, res) => {
  try {
    const quotation = await quotationModel.createQuotation(req.body);
    res.status(201).json(quotation);
  } catch (err) {
    console.error('❌ Create Quotation Error:', err);
    res.status(500).json({ error: 'Failed to create quotation' });
  }
};

// ✅ Get Quotation by ID
exports.getQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await quotationModel.getQuotationById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    console.error('❌ Get Quotation Error:', err);
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
};

// ✅ Upload PDF to /uploads/quotations/{quotationId}/filename.pdf
exports.uploadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const folderPath = path.join(__dirname, '..', 'uploads', 'quotations', id);
    fs.mkdirSync(folderPath, { recursive: true });

    // Use the file that was already stored by multer in the folder
    const oldPath = req.file.path;
    const newFileName = `quotation-${Date.now()}.pdf`;
    const newPath = path.join(folderPath, newFileName);

    fs.renameSync(oldPath, newPath);

    const relativeUrl = `/uploads/quotations/${id}/${newFileName}`;
    await quotationModel.updatePDFUrl(id, relativeUrl);

    res.status(200).json({
      message: 'PDF uploaded and saved successfully',
      pdfUrl: relativeUrl,
    });
  } catch (err) {
    console.error('❌ Upload PDF Error:', err);
    res.status(500).json({ error: 'Failed to upload and save PDF' });
  }
};

// ✅ Send Email with PDF Attachment
exports.sendQuotationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await quotationModel.getQuotationById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    if (!quotation.pdf_url) {
      return res.status(400).json({ error: 'No PDF associated with this quotation' });
    }

    const pdfPath = path.join(__dirname, '..', quotation.pdf_url.replace(/^\/+/, '')); // clean leading slash
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found on server' });
    }

    await sendEmail({
      to: quotation.client_email,
      subject: `Quotation ${quotation.quotation_no}`,
      text: `Dear ${quotation.client_name},\n\nPlease find attached your quotation.`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath,
        },
      ],
    });

    res.status(200).json({ message: 'Quotation email sent successfully' });
  } catch (err) {
    console.error('❌ Send Email Error:', err);
    res.status(500).json({ error: 'Failed to send quotation email' });
  }
};
