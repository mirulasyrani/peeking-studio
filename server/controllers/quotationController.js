const quotationModel = require('models/quotation');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/mailer'); // ✅ Ensure this util exists

// ✅ Create Quotation
exports.createQuotation = async (req, res) => {
  try {
    console.log('Received quotation data:', req.body);

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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
};

// ✅ Upload PDF and save file path to DB
exports.uploadPDF = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;
    await quotationModel.updatePDFUrl(id, pdfUrl);

    res.status(200).json({ message: 'PDF uploaded successfully', pdfUrl });
  } catch (err) {
    console.error('❌ Upload PDF Error:', err);
    res.status(500).json({ error: 'Failed to upload PDF' });
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

    const pdfPath = path.join(__dirname, '..', quotation.pdf_url);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found on server' });
    }

    // Email details
    const subject = `Quotation ${quotation.quotation_no}`;
    const text = `Dear ${quotation.client_name},\n\nPlease find attached your quotation.`;
    const to = quotation.client_email;

    await sendEmail({
      to,
      subject,
      text,
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
