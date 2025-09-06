// const express = require('express');
// const router = express.Router();
// const authCtrl = require('../controllers/authController');

// router.get('/register', authCtrl.showRegister);
// router.post('/register', authCtrl.register);

// router.get('/login', authCtrl.showLogin);
// router.post('/login', authCtrl.login);

// router.get('/logout', authCtrl.logout);

// module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

// GET register page
router.get('/register', (req, res) => {
  res.render('auth/register'); // Renders views/auth/register.ejs
});

// GET login page
router.get('/login', (req, res) => {
  res.render('auth/login'); // Renders views/auth/login.ejs
});

module.exports = router;

