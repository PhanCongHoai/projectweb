const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
        defaultValue: 0,
      },
      created_at: DataTypes.DATE,
      update_at: {
        type: DataTypes.DATE,
        field: "update_at",
      },
    },
    {
      tableName: "Users",
      timestamps: false,
    }
  );

  return User; // ✅ Đúng: trả về model
};
