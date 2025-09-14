const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success:false, message: 'Please login to continue' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).populate('tenant');
    if (!user) return res.status(401).json({ success:false, message: 'User not found' });
    req.user = user;
    req.tenant = user.tenant;
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success:false, message: 'Please login to continue' });
    if (req.user.role !== role) return res.status(403).json({ success:false, message: 'You don\'t have permission to perform this action' });
    next();
  };
}

module.exports = { auth, requireRole };
