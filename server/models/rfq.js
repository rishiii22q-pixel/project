import { DataTypes } from 'sequelize';

export function RFQModel(sequelize) {
  return sequelize.define('RFQ', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'open', 'closed'),
      defaultValue: 'draft',
    },
    budgetEstimate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'rfqs',
  });
}
