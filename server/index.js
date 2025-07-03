require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { Pool } = require('pg');

const invoiceRoutes = require('./routes/invoiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const quotationRoutes = require('./routes/quotation');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
});

// ✅ Test DB connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL at:', result.rows[0].now);
  }
});

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://peeking-studio.pages.dev',
  'https://peeking-studio-production.up.railway.app',
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Incoming origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ✅ Log incoming method + URL
app.use((req, res, next) => {
  console.log(`🛬 [${req.method}] ${req.originalUrl}`);
  next();
});

// ✅ Booking API Route (with improved error logging)
app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, sessionType, notes, startTime, endTime } = req.body;
  console.log('📥 Booking payload:', req.body);

  if (!name || !email || !phone || !sessionType || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (name, email, phone, session_type, notes, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone, sessionType, notes || '', startTime, endTime]
    );

    console.log('✅ Booking inserted:', result.rows[0]);
    res.status(200).json({ message: 'Booking saved', data: result.rows[0] });

  } catch (err) {
    console.error('❌ Booking insert error:', err); // 👈 shows full error object
    res.status(500).json({
      error: 'Database insert failed',
      message: err.message,
      stack: err.stack
    });
  }
});

// ✅ API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);

// ✅ Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Photo Studio Backend API Running');
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
