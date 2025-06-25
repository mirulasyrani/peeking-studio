// server/utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Optional: only if using .env for email creds

// ✅ Customize these credentials as needed
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

/**
 * Sends an email with optional attachments
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {Array} [options.attachments] - Array of attachment objects
 */
const sendEmail = async ({ to, subject, text, attachments }) => {
  const mailOptions = {
    from: `"Peeking Studio" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
    to,
    subject,
    text,
    attachments, // e.g., [{ filename, path }]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
