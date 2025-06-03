const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();

require('./config/passport'); 
const passport = require('passport');
const session = require('express-session');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/api/deals', require('./routes/deals'));
 app.use('/api/auth_admin', require('./routes/auth_admin'));
app.use('/auth', require('./routes/auth_oauth'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/Contact'));
app.use('/api/products', require('./routes/Product')); 
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/review'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));