const express = require('express');
const router = express.Router();
const TeamRegistration = require('../models/TeamRegistration');

// @route   POST /api/registrations
// @desc    Register a new team (Auto Verified, Unique HS2026-XXX Team ID)
router.post('/', async (req, res) => {
  console.log("Registration Request:", req.body);

  try {
    const {
      clerkId,
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      phone,
      collegeName,
      college,
      course,
      branch,
      department,
      year,
      city,
      state,
      github,
      videoLink,
      paymentStatus,
      status,
      members,
    } = req.body;

    const finalLeaderPhone = leaderPhone || phone;
    const finalCollegeName = collegeName || college;
    const finalBranch = branch || department;

    // Validate required fields
    if (!teamName || !teamName.trim()) {
      return res.status(400).json({ success: false, message: 'Team Name is required.' });
    }
    if (!leaderName || !leaderName.trim()) {
      return res.status(400).json({ success: false, message: 'Leader Name is required.' });
    }
    if (!leaderEmail || !leaderEmail.trim()) {
      return res.status(400).json({ success: false, message: 'Leader Email is required.' });
    }
    if (!finalLeaderPhone || !finalLeaderPhone.trim()) {
      return res.status(400).json({ success: false, message: 'Leader Phone is required.' });
    }
    if (!finalCollegeName || !finalCollegeName.trim()) {
      return res.status(400).json({ success: false, message: 'College Name is required.' });
    }

    const normalizedEmail = leaderEmail.toLowerCase().trim();
    const normalizedTeamName = teamName.trim();

    // Check if leader email or team name already registered
    const existingRegistration = await TeamRegistration.findOne({
      $or: [
        { leaderEmail: normalizedEmail },
        { teamName: { $regex: new RegExp(`^${normalizedTeamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
      ],
    });

    if (existingRegistration) {
      if (existingRegistration.leaderEmail === normalizedEmail) {
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

    // Team size validation (Min 3 total: Leader + 2 members; Max 5 total: Leader + 4 members)
    const membersArray = Array.isArray(members) ? members : [];
    if (membersArray.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A team must contain at least 3 members (Leader + at least 2 members).',
      });
    }
    if (membersArray.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Maximum team size is 5 members.',
      });
    }

    // Auto-generate Team ID
    const count = await TeamRegistration.countDocuments();
    const nextNum = (count + 1).toString().padStart(3, '0');
    const teamId = `HS2026-${nextNum}`;

    const newRegistration = new TeamRegistration({
      teamId,
      clerkId: clerkId || '',
      teamName: normalizedTeamName,
      leaderName: leaderName.trim(),
      leaderEmail: normalizedEmail,
      leaderPhone: finalLeaderPhone.trim(),
      collegeName: finalCollegeName.trim(),
      course: course || 'B.Tech',
      branch: finalBranch || '',
      department: finalBranch || '',
      year: year || '',
      city: city || '',
      state: state || '',
      github: github || '',
      videoLink: videoLink || '',
      paymentStatus: paymentStatus || 'Completed',
      members: membersArray,
      status: status || 'Verified',
    });

    const savedTeam = await newRegistration.save();

    console.log("Registration Saved");
    console.log(savedTeam);
    console.log(savedTeam._id);

    return res.status(201).json({
      success: true,
      message: 'Team registered successfully.',
      data: savedTeam,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Server error during team registration.',
    });
  }
});

// @route   GET /api/registrations/check/:clerkId
// @desc    Check if user is already registered
router.get('/check/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { email } = req.query;

    const formattedEmail = email ? email.toLowerCase().trim() : '';
    const formattedClerkId = clerkId && clerkId !== 'unauthenticated' ? clerkId.trim() : '';

    let queryConditions = [];
    if (formattedClerkId) {
      queryConditions.push({ clerkId: formattedClerkId });
    }
    if (formattedEmail) {
      queryConditions.push({ leaderEmail: formattedEmail });
      queryConditions.push({ 'members.email': formattedEmail });
    }

    if (queryConditions.length === 0) {
      return res.json({ registered: false });
    }

    const team = await TeamRegistration.findOne({ $or: queryConditions });

    if (team) {
      return res.json({
        registered: true,
        message: 'Already Registered',
        data: team,
      });
    }

    return res.json({ registered: false });
  } catch (error) {
    console.error('Check Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message });
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
// @desc    Get registration analytics (Total Teams, Participants, Verified, Pending, Rejected, Today, Avg Size, Top College)
router.get('/stats', async (req, res) => {
  try {
    const teams = await TeamRegistration.find({});
    const totalTeams = teams.length;

    let totalParticipants = 0;
    let verifiedTeams = 0;
    let pendingTeams = 0;
    let rejectedTeams = 0;
    let todayRegistrations = 0;

    const collegeCounts = {};
    const todayStr = new Date().toISOString().split('T')[0];

    teams.forEach((t) => {
      const teamSize = 1 + (t.members ? t.members.length : 0);
      totalParticipants += teamSize;

      const status = t.status || 'Verified';
      if (status === 'Verified') verifiedTeams++;
      else if (status === 'Pending') pendingTeams++;
      else if (status === 'Rejected') rejectedTeams++;

      if (t.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === todayStr) {
        todayRegistrations++;
      }

      if (t.collegeName) {
        const cName = t.collegeName.trim();
        collegeCounts[cName] = (collegeCounts[cName] || 0) + 1;
      }
    });

    // Find top college
    let topCollege = 'N/A';
    let maxCollegeCount = 0;
    Object.entries(collegeCounts).forEach(([col, count]) => {
      if (count > maxCollegeCount) {
        maxCollegeCount = count;
        topCollege = col;
      }
    });

    const avgTeamSize = totalTeams > 0 ? (totalParticipants / totalTeams).toFixed(1) : '0';
    const latestTeam = teams.length > 0 ? teams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;

    res.json({
      success: true,
      data: {
        totalTeams,
        targetTeams: 250,
        totalParticipants,
        totalColleges: Object.keys(collegeCounts).length,
        verifiedTeams,
        pendingTeams,
        rejectedTeams,
        todayRegistrations,
        avgTeamSize,
        topCollege,
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

// @route   PUT /api/registrations/:id/status
// @desc    Update a team's verification status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Verified', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const team = await TeamRegistration.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found' });
    }

    team.status = status;
    const updatedTeam = await team.save();

    res.json({
      success: true,
      message: `Team status updated to ${status}`,
      data: updatedTeam,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update team status', error: error.message });
  }
});

// @route   PUT /api/registrations/:id
// @desc    Update full team registration details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const team = await TeamRegistration.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found' });
    }

    Object.assign(team, updateData);
    const updatedTeam = await team.save();

    res.json({
      success: true,
      message: 'Team registration details updated successfully',
      data: updatedTeam,
    });
  } catch (error) {
    console.error('Update Team Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update team details', error: error.message });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete a team registration
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeam = await TeamRegistration.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!deletedTeam) {
      return res.status(404).json({ success: false, message: 'Team registration not found' });
    }

    res.json({
      success: true,
      message: 'Team registration deleted successfully',
      data: deletedTeam,
    });
  } catch (error) {
    console.error('Delete Team Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team registration', error: error.message });
  }
});

// @route   POST /api/registrations/bulk-status
// @desc    Update status for multiple teams in bulk
router.post('/bulk-status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No team IDs provided' });
    }

    if (!['Verified', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const mongoIds = ids.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));
    const customTeamIds = ids.filter((id) => !id.match(/^[0-9a-fA-F]{24}$/));

    await TeamRegistration.updateMany(
      { $or: [{ _id: { $in: mongoIds } }, { teamId: { $in: customTeamIds } }] },
      { $set: { status } }
    );

    res.json({
      success: true,
      message: `Successfully updated ${ids.length} teams to ${status}`,
    });
  } catch (error) {
    console.error('Bulk Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to perform bulk status update', error: error.message });
  }
});

// @route   POST /api/registrations/bulk-delete
// @desc    Delete multiple teams in bulk
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No team IDs provided' });
    }

    const mongoIds = ids.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));
    const customTeamIds = ids.filter((id) => !id.match(/^[0-9a-fA-F]{24}$/));

    const result = await TeamRegistration.deleteMany({
      $or: [{ _id: { $in: mongoIds } }, { teamId: { $in: customTeamIds } }],
    });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} teams`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to perform bulk deletion', error: error.message });
  }
});

module.exports = router;
