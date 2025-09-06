const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');

// Search products
router.get('/', productCtrl.search);

module.exports = router;
