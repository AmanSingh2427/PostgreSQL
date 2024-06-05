const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.6',
  database: 'php_training',
  password: 'mawai123',
  port: 5432,
});

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('image');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thakuraman8630@gmail.com',
    pass: 'Aman@999$ingh',
  },
  secure: false, // Use TLS
  tls: {
    rejectUnauthorized: false, // Ignore certificate errors
  },
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'thakuraman8630@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Signup route
app.post('/signup', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    const { username, password, email, fullName } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
      // Check if email already exists
      const existingUser = await pool.query('SELECT * FROM aman.users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).send({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO aman.users (username, password, email, full_name, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, hashedPassword, email, fullName, imagePath]
      );

      // Send email on successful registration
      sendEmail(
        email,
        'Registration Successful',
        `Hello ${fullName},\n\nYou have successfully registered with the username: ${username}.`
      );

      console.log('Registration email sent to:', email);
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM aman.users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user.rows[0].id }, 'your_secret_key');
    res.json({ 
      token, 
      userImage: user.rows[0].image // Send image URL in the response
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user details route
app.get('/user-details', async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    const userId = decoded.userId;

    const user = await pool.query('SELECT username, email, full_name, image FROM aman.users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update profile route
app.post('/update-profile', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    const userId = decoded.userId;

    const { username, email, fullName } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
      const updateQuery = `
        UPDATE aman.users 
        SET username = $1, email = $2, full_name = $3 ${imagePath ? ', image = $4' : ''} 
        WHERE id = $5 
        RETURNING *`;
      
      const queryParams = [username, email, fullName];
      if (imagePath) {
        queryParams.push(imagePath);
      }
      queryParams.push(userId);

      const updatedUser = await pool.query(updateQuery, queryParams);

      // Send email on successful profile update
      sendEmail(
        email,
        'Profile Updated',
        `Hello ${fullName},\n\nYour profile has been updated successfully. Here are your new details:\n\nUsername: ${username}\nEmail: ${email}\nFull Name: ${fullName}`
      );

      console.log('Profile update email sent to:', email);
      res.json(updatedUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
});

app.get('/', (req, res) => {
  console.log('Home page');
  res.send('Home page');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
