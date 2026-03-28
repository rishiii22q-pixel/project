import express from 'express';
import { RFQ, Quotation } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const rfq = await RFQ.create(req.body);
    res.status(201).json(rfq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const rfqs = await RFQ.findAll({
    include: [{ model: Quotation, as: 'quotations' }],
    order: [['createdAt', 'DESC']],
  });
  res.json(rfqs);
});

router.get('/:id', async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id, { include: [{ model: Quotation, as: 'quotations' }] });
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }
  res.json(rfq);
});

router.patch('/:id/status', async (req, res) => {
  const rfq = await RFQ.findByPk(req.params.id);
  if (!rfq) {
    return res.status(404).json({ error: 'RFQ not found' });
  }
  const { status } = req.body;
  if (!['draft', 'open', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await rfq.update({ status });
  res.json(rfq);
});

export default router;
