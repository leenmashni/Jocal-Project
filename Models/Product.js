const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  date: String,
  price: Number,
});

const productSchema = new mongoose.Schema({
  title: String,
  url: String,
  price: Number,
  original_price: Number,
  on_sale: Boolean,
  image: String,
  description: String,
  brand: String,
  category: String,
  subcategory: String,
  source: String,
  avg_rating: Number,
  created_at: String,
  last_updated: String,
  price_history: [priceHistorySchema],
});

module.exports = mongoose.model('Product', productSchema);