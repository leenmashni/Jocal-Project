const express = require('express');
const router = express.Router();
const Deal = require('../Models/deals'); 


router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post('/', async (req, res) => {
  const { title, promo, video } = req.body;
  try {
    const newDeal = new Deal({ title, promo, video });
    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, promo, video } = req.body;

  try {
    const updated = await Deal.findByIdAndUpdate(id, { title, promo, video }, { new: true });
    if (!updated) return res.status(404).json({ error: "Deal not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Deal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Deal not found" });
    res.json({ message: "Deal deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
