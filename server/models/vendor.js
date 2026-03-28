import { DataTypes } from 'sequelize';

export function VendorModel(sequelize) {
  return sequelize.define('Vendor', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ifsc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    evaluationScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    preQualification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performanceReviews: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    blacklistReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileStatus: {
      type: DataTypes.ENUM('pending', 'active', 'blacklisted'),
      defaultValue: 'pending',
    },
    documents: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'vendors',
  });
}
