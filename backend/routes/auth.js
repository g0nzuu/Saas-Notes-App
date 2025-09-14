const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { auth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success:false, message: 'email and password required' });
  const user = await User.findOne({ email }).populate('tenant');
  if (!user) return res.status(401).json({ success:false, message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ success:false, message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ success:true, message: 'Login successful', data: { token, tenant: { slug: user.tenant.slug, name: user.tenant.name, plan: user.tenant.plan }, role: user.role, email: user.email } });
});

// me - return current user & tenant info
router.get('/me', auth, async (req, res) => {
  const u = req.user;
  return res.json({ success:true, message: 'User data', data: { email: u.email, role: u.role, tenant: { slug: u.tenant.slug, name: u.tenant.name, plan: u.tenant.plan } }});
});

module.exports = router;
