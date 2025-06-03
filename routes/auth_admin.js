const express = require('express');
const router = express.Router();
const Admin = require('../Models/admins'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }); 

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
