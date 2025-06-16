const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
module.exports = (sequelize, DataTypes) => {
const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id", // 👈 Ánh xạ đúng tên cột trong SQL
    },
  },
  {
    tableName: "Cart",
    timestamps: false,
  underscored: true
  }
);

return Cart;
}