const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { auth } = require('../middleware/auth');
const { success, error } = require('../middleware/response');

// Upgrade tenant plan (Admin only)
router.post('/:slug/upgrade', auth, async (req, res) => {
  const slug = req.params.slug;
  if (!req.tenant || req.tenant.slug !== slug) return error(res, 403, 'You don\'t have permission to upgrade this tenant');
  if (req.user.role !== 'Admin') return error(res, 403, 'Only Admin can upgrade');
  const tenant = await Tenant.findOne({ slug });
  if (!tenant) return error(res, 404, 'Tenant not found');
  tenant.plan = 'pro';
  await tenant.save();
  return success(res, 'Tenant upgraded to Pro', { slug: tenant.slug, plan: tenant.plan });
});

module.exports = router;
