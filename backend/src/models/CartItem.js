const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
module.exports = (sequelize, DataTypes) => {
const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CartId", // 👈 thêm field nếu tên cột trong SQL là viết hoa
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ProductId", // 👈 thêm field nếu cần
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "CartItem",
    timestamps: false,
  underscored: true
  }
);

return CartItem;
}