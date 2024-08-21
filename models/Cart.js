const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
