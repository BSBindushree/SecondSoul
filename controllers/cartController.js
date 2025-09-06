const db = require('../config/db'); // This connects to MySQL

exports.viewCart = (req, res) => res.send('Cart page');
exports.addToCart = (req, res) => res.send('Added to cart');
exports.checkout = (req, res) => res.send('Checked out');
