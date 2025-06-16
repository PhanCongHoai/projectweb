const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'UserId'
    },
    orderDate: {
      type: DataTypes.STRING,
      field: 'OrderDate'
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      field: 'TotalAmount'
    },
    status: {
      type: DataTypes.STRING,
      field: 'Status'
    },
    name: {
  type: DataTypes.STRING,
  field: 'Name'
},
phone: {
  type: DataTypes.STRING,
  field: 'Phone'
},
address: {
  type: DataTypes.STRING,
  field: 'Address'
}

  }, {
    tableName: 'Orders',
    timestamps: false
  });

  return Order;
}
