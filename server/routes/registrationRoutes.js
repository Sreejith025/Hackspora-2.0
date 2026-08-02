const express = require('express');
const router = express.Router();
const TeamRegistration = require('../models/TeamRegistration');

// @route   POST /api/registrations
// @desc    Register a new team (Auto Verified, Unique HS2026-XXX Team ID)
router.post('/', async (req, res) => {
  try {
    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      collegeName,
      course,
      branch,
      year,
      city,
      state,
      members,
    } = req.body;

    // Check if leader email or team name already registered
    const existingRegistration = await TeamRegistration.findOne({
      $or: [
        { leaderEmail: leaderEmail.toLowerCase().trim() },
        { teamName: { $regex: new RegExp(`^${teamName.trim()}$`, 'i') } },
      ],
    });

    if (existingRegistration) {
      if (existingRegistration.leaderEmail === leaderEmail.toLowerCase().trim()) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered as a team leader.',
          data: existingRegistration,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'A team with this name already exists. Please choose a different name.',
      });
    }

    // Auto-generate Team ID
    const count = await TeamRegistration.countDocuments();
    const nextNum = (count + 1).toString().padStart(3, '0');
    const teamId = `HS2026-${nextNum}`;

    const newRegistration = new TeamRegistration({
      teamId,
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      collegeName,
      course,
      branch,
      year,
      city,
      state,
      members: members || [],
      status: 'Verified',
    });

    const savedTeam = await newRegistration.save();

    res.status(201).json({
      success: true,
      message: 'Team registered successfully.',
      data: savedTeam,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during team registration.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations with search & filtering (Admin Access)
router.get('/', async (req, res) => {
  try {
    const { search, college, sort = 'newest' } = req.query;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { teamId: searchRegex },
        { teamName: searchRegex },
        { leaderName: searchRegex },
        { collegeName: searchRegex },
        { leaderEmail: searchRegex },
      ];
    }

    if (college && college !== 'All') {
      query.collegeName = college;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const teams = await TeamRegistration.find(query).sort(sortOption);

    res.json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    console.error('Get Registrations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team registrations.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations/my-team
// @desc    Get single team registration by leader email or member email
router.get('/my-team', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query is required' });
    }

    const searchEmail = email.toLowerCase().trim();
    const team = await TeamRegistration.findOne({
      $or: [{ leaderEmail: searchEmail }, { 'members.email': searchEmail }],
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'No team registration found for this user.',
      });
    }

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Get My Team Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team information.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations/stats
// @desc    Get registration analytics (Total Teams, Total Participants, Total Colleges, Latest Reg)
router.get('/stats', async (req, res) => {
  try {
    const teams = await TeamRegistration.find({});
    const totalTeams = teams.length;

    let totalParticipants = 0;
    const collegesSet = new Set();

    teams.forEach((t) => {
      totalParticipants += 1 + (t.members ? t.members.length : 0);
      if (t.collegeName) collegesSet.add(t.collegeName.trim());
      if (t.members) {
        t.members.forEach((m) => {
          if (m.collegeName) collegesSet.add(m.collegeName.trim());
        });
      }
    });

    const latestTeam = teams.length > 0 ? teams.sort((a, b) => b.createdAt - a.createdAt)[0] : null;

    res.json({
      success: true,
      data: {
        totalTeams,
        targetTeams: 250,
        totalParticipants,
        totalColleges: collegesSet.size,
        latestRegistration: latestTeam
          ? {
              teamName: latestTeam.teamName,
              teamId: latestTeam.teamId,
              registeredAt: latestTeam.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration statistics.',
      error: error.message,
    });
  }
});

module.exports = router;
