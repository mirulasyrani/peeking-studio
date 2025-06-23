const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const invoiceSchema = require('../validators/invoiceSchema');
const db = require('../db'); // PG Pool instance
const { z } = require('zod');

// Zod validation wrapper
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

// Apply admin JWT middleware to all /api/admin routes
router.use(requireAdmin);

// Create new invoice
router.post('/invoices', validate(invoiceSchema), async (req, res) => {
  const { clientName, email, sessionType, date, amount, notes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO invoices (client_name, email, session_type, date, amount, notes, paid)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING *`,
      [clientName, email, sessionType, date, amount, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting invoice:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete invoice
router.delete('/invoices/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM invoices WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});

// Confirm payment
router.patch('/invoices/:id/confirm', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE invoices SET paid = true WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

module.exports = router;
