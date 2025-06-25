// server/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
});

const sendEmail = async ({ to, subject, text, attachments }) => {
  const mailOptions = {
    from: '"Peeking Studio" <your-email@gmail.com>',
    to,
    subject,
    text,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
