const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../Models/users');

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }
      
      // Create new user if doesn't exist
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        // No password for OAuth users
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Get email from GitHub profile
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      
      if (!email) {
        return done(new Error('GitHub email not available'), null);
      }
      
      // Check if user already exists
      let user = await User.findOne({ email });
      
      if (user) {
        return done(null, user);
      }
      
      // Create new user if doesn't exist
      user = new User({
        username: profile.displayName || profile.username,
        email,
        // No password for OAuth users
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
