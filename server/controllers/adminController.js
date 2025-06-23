const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
  const admin = result.rows[0];

  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: 'admin' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  res.json({ token });
};
