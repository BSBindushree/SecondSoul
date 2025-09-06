const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

// Dashboard
router.get('/', userCtrl.dashboard);

// Profile edit
router.get('/edit', userCtrl.showEdit);
router.post('/edit', userCtrl.updateProfile);

module.exports = router;
