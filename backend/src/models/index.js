const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = require("./product")(sequelize, DataTypes);
const Cart = require("./Cart")(sequelize, DataTypes);
const CartItem = require("./CartItem")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Order = require("./Orders")(sequelize, DataTypes);
const OrderItem = require("./OrderItem")(sequelize, DataTypes);

// Tạo object models
const models = {
  sequelize,
  Sequelize,
  Product,
  Cart,
  CartItem,
  User,
  Order,
  OrderItem
};

// Thiết lập quan hệ theo kiểu static (cũ)
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// 👇 Gọi associate nếu có (nếu bạn thêm phần associate vào mỗi file model)
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
