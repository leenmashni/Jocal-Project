const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, body) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: body
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
}

module.exports = sendEmail;
