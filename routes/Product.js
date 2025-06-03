const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const auth = require('../middleware/auth');

// ✅ GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


router.get('/:id', async (req, res) => {
  console.log("📦 Requested product ID:", req.params.id);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add PATCH route to update product (for avg_rating)
router.patch('/:id', async (req, res) => {
  try {
    console.log("📝 Updating product:", req.params.id, req.body);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("Product updated successfully:", updatedProduct.title);
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Simple endpoint for updating just the rating
router.post('/:id/rating', async (req, res) => {
  try {
    const { rating } = req.body;

    if (typeof rating !== 'number') {
      return res.status(400).json({ message: 'Rating must be a number' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { avg_rating: rating } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Rating updated for ${updatedProduct.title}: ${rating}`);
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating rating:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;