const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
module.exports = (sequelize, DataTypes) => {
const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
  },
  {
    tableName: "Category",
    timestamps: false,
  }
);
return { Category };
}

