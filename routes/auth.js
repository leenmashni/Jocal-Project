

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../Models/users'); 
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();



router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = new User({
  username,
  email,
  password: hashedPassword,
});


    await newUser.save();

    res.status(201).json({ message: 'Account created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '60minutes',
    });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/reset-password/${token}`; 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Jocal - Reset Your Password',
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset link sent to your email' });

  } catch (error) {
    console.error("Forgot Password Error:", error);
   res.status(500).json({ message: 'Server error', error });
  }
});
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;