// Import the Nodemailer library
const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'thakuraman8630@gmail.com',
    pass: 'sdqgihpkffcyipzj',
  }
});

// Configure the mailoptions object
const mailOptions = {
  from: 'thakuraman8630@gmail.com',
  to: 'anirudh1502@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

// Send the email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error:' + error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});