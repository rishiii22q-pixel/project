import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Vendor } from '../models/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_TTL = '8h';

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      role = 'vendor',
      name,
      companyName,
      category,
      gstNumber,
      panNumber,
      bankAccount,
      ifsc,
      phone,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password, and role are required' });
    }

    if (role !== 'vendor') {
      return res.status(403).json({ error: 'Only vendor registration is supported through this endpoint' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const vendor = await Vendor.create({
      name,
      companyName,
      category,
      gstNumber,
      panNumber,
      bankAccount,
      ifsc,
      email,
      phone,
    });

    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({ email, password: hashed, role, vendorId: vendor.id });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, vendorId: user.vendorId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, vendorId: user.vendorId } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, vendorId: user.vendorId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, vendorId: user.vendorId } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json(payload);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
