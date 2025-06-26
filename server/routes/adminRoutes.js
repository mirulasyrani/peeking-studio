const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const db = require('../db'); // PostgreSQL pool
const { invoiceSchema, invoiceIdParamSchema } = require('../validators/invoiceSchema');

// ✅ Reusable Zod validation middleware with source support
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    schema.parse(req[source]);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

// ✅ Apply admin JWT middleware to all routes
router.use(requireAdmin);

// ✅ Create new invoice
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

// ✅ Delete invoice (with param validation)
router.delete('/invoices/:id', validate(invoiceIdParamSchema, 'params'), async (req, res) => {
  try {
    await db.query(`DELETE FROM invoices WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});

// ✅ Confirm payment (with param validation)
router.patch('/invoices/:id/confirm', validate(invoiceIdParamSchema, 'params'), async (req, res) => {
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
