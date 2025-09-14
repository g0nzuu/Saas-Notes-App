const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { auth } = require('../middleware/auth');
const { success, error } = require('../middleware/response');

// Create note (Member or Admin)
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title) return error(res, 400, 'Title is required');
  const tenant = req.tenant;
  // check plan limit if free
  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenant._id });
    if (count >= 3) return error(res, 403, 'Free plan limit reached. Upgrade to Pro.');
  }
  const note = new Note({
    title, content,
    tenant: tenant._id,
    owner: req.user._id
  });
  await note.save();
  return success(res, 'Note created successfully', note);
});

// List notes for tenant
router.get('/', auth, async (req, res) => {
  const notes = await Note.find({ tenant: req.tenant._id }).sort({ createdAt: -1 });
  return success(res, 'Notes fetched', notes);
});

// Get note by id (must belong to same tenant)
router.get('/:id', auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.tenant._id });
  if (!note) return error(res, 404, 'Note not found');
  return success(res, 'Note fetched', note);
});

// Update note
router.put('/:id', auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.tenant._id });
  if (!note) return error(res, 404, 'Note not found');
  const { title, content } = req.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  await note.save();
  return success(res, 'Note updated', note);
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.tenant._id });
  if (!note) return error(res, 404, 'Note not found');
  return success(res, 'Note deleted');
});

module.exports = router;
