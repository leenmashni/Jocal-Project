const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '60minutes',
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/oauth-success?token=${token}&userId=${req.user._id}&username=${req.user.username}&email=${req.user.email}`);
  }
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '60minutes',
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/oauth-success?token=${token}&userId=${req.user._id}&username=${req.user.username}&email=${req.user.email}`);
  }
);

module.exports = router;
