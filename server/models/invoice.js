import { DataTypes } from 'sequelize';

export function InvoiceModel(sequelize) {
  return sequelize.define('Invoice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gst: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    tds: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    totalPayable: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'paid', 'overdue'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'invoices',
  });
}
