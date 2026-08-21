const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

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

// @route   GET /api/announcements/published
// @desc    Get published announcements only (Participant/Public endpoint)
router.get('/published', async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'published' }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching published announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch published announcements',
      error: error.message,
    });
  }
});

// @route   GET /api/announcements/admin
// @desc    Get all announcements (Admin endpoint)
router.get('/admin', verifyAdminAccess, async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements for admin',
      error: error.message,
    });
  }
});

// @route   GET /api/announcements
// @desc    Get announcements (If admin header present -> all; else -> published)
router.get('/', async (req, res) => {
  try {
    const adminEmailHeader = req.headers['x-admin-email'] || req.query.adminEmail;
    const isAdmin = adminEmailHeader && adminEmailHeader.toLowerCase().trim() === ADMIN_EMAIL;

    const query = isAdmin ? {} : { status: 'published' };
    const announcements = await Announcement.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
});

// @route   POST /api/announcements
// @desc    Create a new announcement (Admin only)
router.post('/', verifyAdminAccess, async (req, res) => {
  try {
    const { title, message, type, link, status } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message content are required.',
      });
    }

    const newAnnouncement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      type: type || 'general',
      link: link ? link.trim() : '',
      status: status || 'published',
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully!',
      data: newAnnouncement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message,
    });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update an announcement (Admin only)
router.put('/:id', verifyAdminAccess, async (req, res) => {
  try {
    const { title, message, type, link, status } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    if (title !== undefined) announcement.title = title.trim();
    if (message !== undefined) announcement.message = message.trim();
    if (type !== undefined) announcement.type = type;
    if (link !== undefined) announcement.link = link.trim();
    if (status !== undefined) announcement.status = status;

    await announcement.save();

    return res.json({
      success: true,
      message: 'Announcement updated successfully!',
      data: announcement,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message,
    });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement (Admin only)
router.delete('/:id', verifyAdminAccess, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Announcement deleted successfully!',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message,
    });
  }
});

// @route   PATCH /api/announcements/:id/publish
// @desc    Publish / Unpublish an announcement (Admin only)
router.patch('/:id/publish', verifyAdminAccess, async (req, res) => {
  try {
    const { status } = req.body; // 'published' or 'draft'
    
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    announcement.status = status || (announcement.status === 'published' ? 'draft' : 'published');
    await announcement.save();

    return res.json({
      success: true,
      message: `Announcement ${announcement.status === 'published' ? 'published' : 'unpublished'} successfully!`,
      data: announcement,
    });
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update publish status',
      error: error.message,
    });
  }
});

module.exports = router;
