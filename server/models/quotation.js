import { DataTypes } from 'sequelize';

export function QuotationModel(sequelize) {
  return sequelize.define('Quotation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('submitted', 'review', 'approved', 'rejected'),
      defaultValue: 'submitted',
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'quotations',
  });
}
