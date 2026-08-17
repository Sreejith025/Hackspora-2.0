const express = require('express');
const router = express.Router();
const ProblemStatement = require('../models/ProblemStatement');

const ADMIN_EMAIL = 'abisri024@gmail.com';

// Middleware to check admin authorization
const verifyAdminAccess = (req, res, next) => {
  const adminEmailHeader = req.headers['x-admin-email'] || req.query.adminEmail || req.body?.adminEmail;
  if (!adminEmailHeader || adminEmailHeader.toLowerCase().trim() !== ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Admin authorization required.',
    });
  }
  req.adminEmail = adminEmailHeader.toLowerCase().trim();
  next();
};

// @route   GET /api/problem-statements/published
// @desc    Get published problem statements only (Participant/Public endpoint)
router.get('/published', async (req, res) => {
  try {
    const items = await ProblemStatement.find({ status: 'published' }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching published problem statements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/problem-statements
// @desc    Get problem statements (if status query, filters; if no query and admin header, returns all)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const adminEmailHeader = req.headers['x-admin-email'] || req.query.adminEmail;

    let query = {};

    if (status) {
      query.status = status.toLowerCase();
    } else if (!adminEmailHeader || adminEmailHeader.toLowerCase().trim() !== ADMIN_EMAIL) {
      // By default for non-admins / participants, show published only
      query.status = 'published';
    }

    const items = await ProblemStatement.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching problem statements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/problem-statements
// @desc    Create/publish new Problem Statement (Admin only)
router.post('/', verifyAdminAccess, async (req, res) => {
  try {
    const { name, description, link, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Problem Statement Name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Problem Statement Description is required.' });
    }

    const initialStatus = status && ['draft', 'unpublished'].includes(status.toLowerCase()) ? 'draft' : 'published';

    const newStatement = new ProblemStatement({
      name: name.trim(),
      description: description.trim(),
      link: link ? link.trim() : '',
      status: initialStatus,
    });

    const saved = await newStatement.save();

    res.status(201).json({
      success: true,
      message: 'Problem Statement created successfully.',
      data: saved,
      statement: saved,
    });
  } catch (error) {
    console.error('Error creating problem statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper for updating problem statement
const handleUpdateStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, link, status } = req.body;

    const item = await ProblemStatement.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Problem Statement not found.' });
    }

    if (name && name.trim()) item.name = name.trim();
    if (description && description.trim()) item.description = description.trim();
    if (typeof link === 'string') item.link = link.trim();
    if (status && ['published', 'unpublished', 'draft'].includes(status.toLowerCase())) {
      item.status = status.toLowerCase() === 'unpublished' ? 'draft' : status.toLowerCase();
    }

    const updated = await item.save();

    res.json({
      success: true,
      message: 'Problem Statement updated successfully.',
      data: updated,
      statement: updated,
    });
  } catch (error) {
    console.error('Error updating problem statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT & PATCH /api/problem-statements/:id
// @desc    Edit Problem Statement details (Admin only)
router.put('/:id', verifyAdminAccess, handleUpdateStatement);
router.patch('/:id', verifyAdminAccess, handleUpdateStatement);

// @route   PATCH /api/problem-statements/:id/publish
// @desc    Publish a Problem Statement (Admin only)
router.patch('/:id/publish', verifyAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProblemStatement.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Problem Statement not found.' });
    }

    item.status = 'published';
    const updated = await item.save();

    res.json({
      success: true,
      message: 'Problem Statement published successfully.',
      data: updated,
      statement: updated,
    });
  } catch (error) {
    console.error('Error publishing problem statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/problem-statements/:id/unpublish
// @desc    Unpublish a Problem Statement (Admin only)
router.patch('/:id/unpublish', verifyAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProblemStatement.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Problem Statement not found.' });
    }

    item.status = 'draft';
    const updated = await item.save();

    res.json({
      success: true,
      message: 'Problem Statement unpublished successfully.',
      data: updated,
      statement: updated,
    });
  } catch (error) {
    console.error('Error unpublishing problem statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/problem-statements/:id
// @desc    Delete a Problem Statement (Admin only)
router.delete('/:id', verifyAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProblemStatement.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Problem Statement not found.' });
    }

    res.json({
      success: true,
      message: 'Problem Statement deleted successfully.',
      data: item,
    });
  } catch (error) {
    console.error('Error deleting problem statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
