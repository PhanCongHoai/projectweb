const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    title: DataTypes.STRING,
    image_url: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    original_price: DataTypes.INTEGER,
    number: DataTypes.INTEGER, 
    number2: DataTypes.INTEGER, 
    category_id: DataTypes.INTEGER,
    is_suggested: DataTypes.BOOLEAN, // nếu cột có kiểu bit / boolean
  },
  {
    tableName: "Product",
    timestamps: false,
  }
);

module.exports = Product;
