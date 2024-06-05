// // emailService.js

// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'thakuraman8630@gmail.com',
//     pass: 'Aman@999$ingh',
//   },
//   secure: false, // Use TLS
//   tls: {
//     rejectUnauthorized: false, // Ignore certificate errors
//   },
// });

// const sendEmail = (to, subject, text) => {
//   const mailOptions = {
//     from: 'thakuraman8630@gmail.com',
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// module.exports = sendEmail;
