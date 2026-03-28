import express from 'express';
import { PurchaseOrder, Quotation, Vendor, RFQ } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { quotationId, issueDate, deliveryDate } = req.body;
    const quotation = await Quotation.findByPk(quotationId);
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    const po = await PurchaseOrder.create({
      rfqId: quotation.rfqId,
      quotationId: quotation.id,
      vendorId: quotation.vendorId,
      issueDate,
      deliveryDate,
      totalAmount: quotation.totalAmount,
      status: 'pending',
      signature: null,
      trackingNumber: `PO-${Date.now()}`,
    });
    res.status(201).json(po);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const orders = await PurchaseOrder.findAll({
    include: [
      { model: Vendor, as: 'vendor', attributes: ['id', 'companyName', 'name'] },
      { model: Quotation, as: 'quotation', attributes: ['id', 'totalAmount'] },
      { model: RFQ, as: 'rfq', attributes: ['id', 'title'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
});

router.patch('/:id/approve', async (req, res) => {
  const po = await PurchaseOrder.findByPk(req.params.id);
  if (!po) {
    return res.status(404).json({ error: 'PO not found' });
  }
  await po.update({ status: 'approved', signature: req.body.signature || 'Authorized Signature' });
  res.json(po);
});

router.patch('/:id/reject', async (req, res) => {
  const po = await PurchaseOrder.findByPk(req.params.id);
  if (!po) {
    return res.status(404).json({ error: 'PO not found' });
  }
  await po.update({ status: 'rejected' });
  res.json(po);
});

router.get('/:id', async (req, res) => {
  const po = await PurchaseOrder.findByPk(req.params.id, {
    include: [
      { model: Vendor, as: 'vendor' },
      { model: Quotation, as: 'quotation' },
      { model: RFQ, as: 'rfq' },
    ],
  });
  if (!po) {
    return res.status(404).json({ error: 'PO not found' });
  }
  res.json(po);
});

export default router;
