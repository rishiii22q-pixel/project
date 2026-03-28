import express from 'express';
import multer from 'multer';
import { Vendor } from '../models/index.js';

const router = express.Router();
const upload = multer({ dest: './uploads/documents' });

router.post('/', async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const vendors = await Vendor.findAll({ order: [['createdAt', 'DESC']] });
  res.json(vendors);
});

router.get('/:id', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  res.json(vendor);
});

router.put('/:id', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  await vendor.update(req.body);
  res.json(vendor);
});

router.patch('/:id/status', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  const { profileStatus, blacklistReason } = req.body;
  const valid = ['pending', 'active', 'blacklisted'];
  if (profileStatus && !valid.includes(profileStatus)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await vendor.update({ profileStatus: profileStatus || vendor.profileStatus, blacklistReason: blacklistReason || vendor.blacklistReason });
  res.json(vendor);
});

router.patch('/:id/evaluate', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  const { evaluationScore, preQualification, performanceReviews } = req.body;
  await vendor.update({
    evaluationScore: evaluationScore !== undefined ? evaluationScore : vendor.evaluationScore,
    preQualification: preQualification || vendor.preQualification,
    performanceReviews: performanceReviews || vendor.performanceReviews,
  });
  res.json(vendor);
});

router.post('/:id/documents', upload.single('document'), async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }
  const existing = vendor.documents ? JSON.parse(vendor.documents) : [];
  const uploaded = [...existing, { filename: req.file.filename, originalName: req.file.originalname, path: req.file.path }];
  await vendor.update({ documents: JSON.stringify(uploaded) });
  res.json({ documents: uploaded });
});

export default router;
