import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';
import vendorRouter from './routes/vendor.js';
import quotationRouter from './routes/quotation.js';
import rfqRouter from './routes/rfq.js';
import poRouter from './routes/po.js';
import invoiceRouter from './routes/invoice.js';
import inventoryRouter from './routes/inventory.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/quotations', quotationRouter);
app.use('/api/rfqs', rfqRouter);
app.use('/api/purchase-orders', poRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/inventory', inventoryRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'vendor-management-server' });
});

async function start() {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
