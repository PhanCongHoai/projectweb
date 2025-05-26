const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // lấy thuộc tính `sequelize` từ export

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
    product_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    price: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    original_price: DataTypes.INTEGER,
    number: DataTypes.INTEGER,
    number2: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
  },
  {
    tableName: "Product",
    timestamps: false,
  }
);

module.exports = Product;
