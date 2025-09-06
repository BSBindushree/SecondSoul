const db = require('../config/db'); // This connects to MySQL

exports.dashboard = (req, res) => res.send('User Dashboard');
exports.showEdit = (req, res) => res.send('Edit Profile page');
exports.updateProfile = (req, res) => res.send('Profile updated');
