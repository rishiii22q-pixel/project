import { Sequelize } from 'sequelize';
import { VendorModel } from './vendor.js';
import { QuotationModel } from './quotation.js';
import { RFQModel } from './rfq.js';
import { PurchaseOrderModel } from './purchaseOrder.js';
import { InvoiceModel } from './invoice.js';
import { StockReceiptModel } from './stockReceipt.js';
import { UserModel } from './user.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export const Vendor = VendorModel(sequelize);
export const Quotation = QuotationModel(sequelize);
export const RFQ = RFQModel(sequelize);
export const PurchaseOrder = PurchaseOrderModel(sequelize);
export const Invoice = InvoiceModel(sequelize);
export const StockReceipt = StockReceiptModel(sequelize);
export const User = UserModel(sequelize);

Vendor.hasMany(Quotation, { foreignKey: 'vendorId', as: 'quotations' });
Quotation.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

RFQ.hasMany(Quotation, { foreignKey: 'rfqId', as: 'quotations' });
Quotation.belongsTo(RFQ, { foreignKey: 'rfqId', as: 'rfq' });

RFQ.hasMany(PurchaseOrder, { foreignKey: 'rfqId', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(RFQ, { foreignKey: 'rfqId', as: 'rfq' });

Quotation.hasOne(PurchaseOrder, { foreignKey: 'quotationId', as: 'purchaseOrder' });
PurchaseOrder.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });

Vendor.hasMany(PurchaseOrder, { foreignKey: 'vendorId', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

PurchaseOrder.hasMany(StockReceipt, { foreignKey: 'purchaseOrderId', as: 'stockReceipts' });
StockReceipt.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

PurchaseOrder.hasMany(Invoice, { foreignKey: 'purchaseOrderId', as: 'invoices' });
Invoice.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

Vendor.hasMany(User, { foreignKey: 'vendorId', as: 'users' });
User.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
