const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const { CartItem, Product, Purchase } = require('../models');

// View cart
router.get('/', ensureAuthenticated, async (req, res) => {
  const items = await CartItem.findAll({ where: { userId: req.session.userId }, include: Product });
  res.render('cart', { items });
});

// Add to cart
router.post('/add/:productId', ensureAuthenticated, async (req, res) => {
  const productId = req.params.productId;
  const [item, created] = await CartItem.findOrCreate({
    where: { userId: req.session.userId, productId },
    defaults: { quantity: 1 }
  });
  if (!created) { item.quantity += 1; await item.save(); }
  res.redirect('/cart');
});

// Checkout
router.post('/checkout', ensureAuthenticated, async (req, res) => {
  const items = await CartItem.findAll({ where: { userId: req.session.userId } });
  for (const it of items) {
    await Purchase.create({ userId: req.session.userId, productId: it.productId, quantity: it.quantity });
    await it.destroy();
  }
  res.redirect('/purchases');
});

module.exports = router;
