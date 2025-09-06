// const db = require('../config/db'); // This connects to MySQL

// exports.showRegister = (req, res) => res.send('Register page');
// exports.register = (req, res) => res.send('Register POST');
// exports.showLogin = (req, res) => res.send('Login page');
// exports.login = (req, res) => res.send('Login POST');
// exports.logout = (req, res) => {
//   req.session.destroy(() => res.redirect('/'));
// };
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.showRegister = (req, res) => res.render('register'); // create a register.ejs

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashed], (err, result) => {
    if (err) return res.status(500).send('Error registering user');
    res.redirect('/login');
  });
};