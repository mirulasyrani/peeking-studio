const bcrypt = require('bcrypt');
const db = require('../db');

async function createAdmin() {
  const username = 'admin@peeking';
  const plainPassword = 'password123abc!@#';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    await db.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
