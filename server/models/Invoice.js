// models/invoice.js
const db = require('../db');

const createInvoice = async ({ invoice_no, client_name, email, session_type, date, amount, notes, paid }) => {
  const result = await db.query(
    `INSERT INTO invoices (invoice_no, client_name, email, session_type, date, amount, notes, paid)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [invoice_no, client_name, email, session_type, date, amount, notes, paid]
  );
  return result.rows[0];
};

const getInvoiceById = async (id) => {
  const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
  return result.rows[0];
};

const confirmInvoicePayment = async (id) => {
  const result = await db.query(
    `UPDATE invoices SET paid = true WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createInvoice,
  getInvoiceById,
  confirmInvoicePayment,
};
