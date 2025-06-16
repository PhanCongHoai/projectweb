module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      field: 'OrderId'
    },
    productId: {
      type: DataTypes.INTEGER,
      field: 'ProductId'
    },
    quantity: {
      type: DataTypes.INTEGER,
      field: 'Quantity'
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      field: 'UnitPrice'
    }
  }, {
    tableName: 'OrderItem',
    timestamps: false
  });

  // 👇 Thêm phần này để Sequelize biết liên kết
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return OrderItem;
};
