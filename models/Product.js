const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Product extends Model {}
Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true } // path or URL
}, { sequelize, modelName: 'product' });

module.exports = Product;
