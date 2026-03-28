import { DataTypes } from 'sequelize';

export function StockReceiptModel(sequelize) {
  return sequelize.define('StockReceipt', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receivedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    qualityStatus: {
      type: DataTypes.ENUM('pending', 'passed', 'rejected'),
      defaultValue: 'pending',
    },
    returnStatus: {
      type: DataTypes.ENUM('none', 'requested', 'returned'),
      defaultValue: 'none',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'stock_receipts',
  });
}
