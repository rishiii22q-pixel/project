import express from 'express';
import { StockReceipt, PurchaseOrder } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { purchaseOrderId, itemName, quantity, receivedDate, remarks } = req.body;
    const po = await PurchaseOrder.findByPk(purchaseOrderId);
    if (!po) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    const receipt = await StockReceipt.create({
      purchaseOrderId,
      itemName,
      quantity,
      receivedDate,
      qualityStatus: 'pending',
      returnStatus: 'none',
      remarks: remarks || null,
    });
    res.status(201).json(receipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const receipts = await StockReceipt.findAll({ order: [['createdAt', 'DESC']] });
  res.json(receipts);
});

router.patch('/:id/quality', async (req, res) => {
  const receipt = await StockReceipt.findByPk(req.params.id);
  if (!receipt) {
    return res.status(404).json({ error: 'Receipt not found' });
  }
  const { qualityStatus, returnStatus, remarks } = req.body;
  await receipt.update({
    qualityStatus: qualityStatus || receipt.qualityStatus,
    returnStatus: returnStatus || receipt.returnStatus,
    remarks: remarks || receipt.remarks,
  });
  res.json(receipt);
});

export default router;
