const db = require('../config/db'); // This connects to MySQL

exports.list = (req, res) => res.send('All Products');
exports.showCreate = (req, res) => res.send('Create Product page');
exports.create = (req, res) => res.send('Product Created');
exports.myList = (req, res) => res.send('My Products');
exports.showDetail = (req, res) => res.send('Product Detail');
exports.showEdit = (req, res) => res.send('Edit Product page');
exports.update = (req, res) => res.send('Product Updated');
exports.remove = (req, res) => res.send('Product Deleted');
exports.search = (req, res) => res.send('Search Results');
