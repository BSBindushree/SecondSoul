const sequelize = require('../config/db');
const User = require('./user');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Purchase = require('./Purchase');

User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Purchase, { foreignKey: 'userId' });
Purchase.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Purchase, { foreignKey: 'productId' });
Purchase.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Purchase
};
