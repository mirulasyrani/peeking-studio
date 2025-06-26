// db.js
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // ✅ Required by Railway and similar hosts
    : false, // ❌ Disable SSL locally
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
