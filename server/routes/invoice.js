import express from 'express';
import { Invoice, PurchaseOrder } from '../models/index.js';

const router = express.Router();

function computeTaxes(amount) {
  const gst = Number((amount * 0.18).toFixed(2));
  const tds = Number((amount * 0.02).toFixed(2));
  const payable = Number((amount + gst - tds).toFixed(2));
  return { gst, tds, payable };
}

router.post('/generate', async (req, res) => {
  try {
    const { purchaseOrderId, dueDate, paymentTerms } = req.body;
    const po = await PurchaseOrder.findByPk(purchaseOrderId);
    if (!po) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    const { gst, tds, payable } = computeTaxes(po.totalAmount);
    const invoice = await Invoice.create({
      purchaseOrderId,
      amount: po.totalAmount,
      gst,
      tds,
      totalPayable: payable,
      dueDate,
      paymentTerms: paymentTerms || '30 days',
      status: 'pending',
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const invoices = await Invoice.findAll({ order: [['createdAt', 'DESC']] });
  res.json(invoices);
});

router.patch('/:id/pay', async (req, res) => {
  const invoice = await Invoice.findByPk(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  await invoice.update({ status: 'paid' });
  res.json(invoice);
});

router.patch('/:id/status', async (req, res) => {
  const invoice = await Invoice.findByPk(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  const { status } = req.body;
  if (!['draft', 'pending', 'approved', 'paid', 'overdue'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await invoice.update({ status });
  res.json(invoice);
});

export default router;
