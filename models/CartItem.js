const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class CartItem extends Model {}
CartItem.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
}, { sequelize, modelName: 'cartItem' });

module.exports = CartItem;
