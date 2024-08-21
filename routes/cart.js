const express = require('express');
const router = express.Router();
const pool = require('./db'); // Assuming you're using a PostgreSQL pool

// Add item to cart
router.post('/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  try {
    const cartItem = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.json(cartItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Get cart items
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1',
      [userId]
    );
    res.json(cartItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

// Update cart item quantity
router.put('/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCartItem = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    res.json(updatedCartItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

// Remove item from cart
router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM cart WHERE id = $1', [id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

module.exports = router;
