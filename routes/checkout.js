const express = require('express');
const router = express.Router();
const Cart = require('../backend/models/Cart');

// POST /api/checkout
router.post('/', async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Cart is empty' });
    // Process payment (integrate with Stripe or another payment gateway)
    // Clear the cart
    cart.items = [];
    await cart.save();
    res.json({ message: 'Checkout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

