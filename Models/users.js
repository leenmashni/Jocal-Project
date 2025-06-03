

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wishlist: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number,
      url: String
    }
  ]
});

module.exports = mongoose.model('User', userSchema);