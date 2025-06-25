const db = require('../db');

exports.createQuotation = async (data) => {
  const {
    quotation_no,
    client_name,
    client_email,
    client_address,
    project_title,
    project_date,
    notes,
    items,
    total_amount,
    amount_in_words,
    pdf_url
  } = data;

    const result = await db.query(
    `INSERT INTO quotations 
        (quotation_no, client_name, client_email, client_address, project_title, project_date, notes, items, total_amount, amount_in_words, pdf_url, date)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
        quotation_no,
        client_name,
        client_email,
        client_address,
        project_title,
        project_date,
        notes,
        JSON.stringify(items),
        total_amount,
        amount_in_words,
        pdf_url || null,
        new Date() // <- This sets the current timestamp
    ]
    );
        return result.rows[0];
 
};

exports.getQuotationById = async (id) => {
  const result = await db.query(`SELECT * FROM quotations WHERE id = $1`, [id]);
  return result.rows[0];
};

exports.updatePDFUrl = async (id, pdfUrl) => {
  await db.query(
    'UPDATE quotations SET pdf_url = $1 WHERE id = $2',
    [pdfUrl, id]
  );
};
