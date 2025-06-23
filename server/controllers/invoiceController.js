const {
  createInvoiceDB,
  getInvoiceById,
  confirmInvoicePayment,
} = require('../models/Invoice'); // ✅ Capital I

const createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoiceDB(req.body);
    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

const confirmInvoice = async (req, res) => {
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

const getInvoice = async (req, res) => {
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

module.exports = {
  createInvoice,
  confirmInvoice,
  getInvoice,
};
