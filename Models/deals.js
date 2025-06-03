const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  promo: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
