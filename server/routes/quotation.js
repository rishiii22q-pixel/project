import express from 'express';
import { Quotation, Vendor, RFQ } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);
    res.status(201).json(quotation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const quotations = await Quotation.findAll({
    include: [
      { model: Vendor, as: 'vendor', attributes: ['id', 'name', 'companyName', 'category'] },
      { model: RFQ, as: 'rfq', attributes: ['id', 'title'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(quotations);
});

router.get('/rfq/:rfqId', async (req, res) => {
  const quotes = await Quotation.findAll({
    where: { rfqId: req.params.rfqId },
    include: [{ model: Vendor, as: 'vendor', attributes: ['id', 'name', 'companyName', 'category'] }],
  });
  res.json(quotes);
});

router.get('/compare/:rfqId', async (req, res) => {
  const rfqId = req.params.rfqId;
  const quotes = await Quotation.findAll({
    where: { rfqId },
    include: [{ model: Vendor, as: 'vendor', attributes: ['id', 'name', 'companyName', 'category'] }],
  });
  if (!quotes.length) {
    return res.status(404).json({ error: 'No quotations found for this RFQ' });
  }
  const lowest = quotes.reduce((best, quote) => (quote.totalAmount < best.totalAmount ? quote : best), quotes[0]);
  res.json({ quotes, recommendation: lowest });
});

export default router;
