const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/mailer');
const {
  createInvoiceDB,
  getInvoiceById,
  confirmInvoicePayment,
  updateInvoicePDFUrl,
} = require('../models/Invoice');

const createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoiceDB(req.body);

    // ✅ Prepare folder for invoice PDF storage
    const folderPath = path.join(__dirname, '..', 'uploads', 'invoices', `${invoice.id}`);
    fs.mkdirSync(folderPath, { recursive: true });

    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

const getInvoiceByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await getInvoiceById(id);
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (err) {
    console.error('Error retrieving invoice:', err);
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
};

const confirmInvoicePaymentController = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await confirmInvoicePayment(id);
    if (updated) {
      res.json({ message: 'Invoice marked as paid' });
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

const uploadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const folder = path.join('uploads', 'invoices', id);
    const pdfPath = path.join(folder, req.file.filename);

    await updateInvoicePDFUrl(id, `/${pdfPath.replace(/\\/g, '/')}`);

    res.status(200).json({
      message: 'PDF uploaded successfully',
      pdfUrl: `/${pdfPath.replace(/\\/g, '/')}`,
    });
  } catch (err) {
    console.error('❌ Upload PDF Error:', err);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

const sendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await getInvoiceById(id);

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    if (!invoice.pdf_url) {
      return res.status(400).json({ error: 'No PDF associated with this invoice' });
    }

    const pdfPath = path.join(__dirname, '..', invoice.pdf_url);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found on server' });
    }

    const subject = `Invoice ${invoice.invoice_no || id}`;
    const text = `Dear ${invoice.client_name},\n\nPlease find your invoice attached.`;

    await sendEmail({
      to: invoice.email,
      subject,
      text,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath,
        },
      ],
    });

    res.status(200).json({ message: 'Invoice email sent successfully' });
  } catch (err) {
    console.error('❌ Send Invoice Email Error:', err);
    res.status(500).json({ error: 'Failed to send invoice email' });
  }
};

module.exports = {
  createInvoice,
  getInvoiceById: getInvoiceByIdController,
  confirmInvoicePayment: confirmInvoicePaymentController,
  uploadInvoicePDF,
  sendInvoiceEmail,
};
