const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'admin@peeking',
  password: 'password123abc!@#',
  host: 'localhost',
  port: 5432,
  database: 'photo-studio',
});

module.exports = pool;
