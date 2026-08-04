const express = require('express');
const router = express.Router();
const TeamRegistration = require('../models/TeamRegistration');

// @route   POST /api/registrations
// @desc    Register a new team (Saved directly to MongoDB, verified doc creation, Socket.IO broadcast)
router.post('/', async (req, res) => {
  try {
    console.log('\n--------------------------------------------------');
    console.log('[REGISTRATION RECEIVED] Incoming payload:');
    console.log(
      JSON.stringify(
        {
          teamName: req.body.teamName,
          leaderName: req.body.leaderName,
          leaderEmail: req.body.leaderEmail,
          leaderPhone: req.body.leaderPhone,
          collegeName: req.body.collegeName,
          membersCount: req.body.members ? req.body.members.length : 0,
        },
        null,
        2
      )
    );

    const {
      clerkId,
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

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !collegeName) {
      console.warn('[REGISTRATION ERROR] Missing required fields');
      return res.status(400).json({
        success: false,
        message:
          'All required fields (Team Name, Leader Name, Leader Email, Leader Phone, College Name) must be provided.',
      });
    }

    const cleanLeaderEmail = leaderEmail.toLowerCase().trim();
    const cleanTeamName = teamName.trim();
    const cleanLeaderPhone = leaderPhone.trim();

    // Comprehensive duplicate checks against existing MongoDB documents
    const existingLeaderEmail = await TeamRegistration.findOne({
      $or: [{ leaderEmail: cleanLeaderEmail }, { 'members.email': cleanLeaderEmail }],
    });

    if (existingLeaderEmail) {
      console.warn(`[REGISTRATION REJECTED] Duplicate Email: ${cleanLeaderEmail}`);
      return res.status(409).json({
        success: false,
        message: `The email "${cleanLeaderEmail}" is already registered in a team.`,
        data: existingLeaderEmail,
      });
    }

    const existingTeamName = await TeamRegistration.findOne({
      teamName: { $regex: new RegExp(`^${cleanTeamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (existingTeamName) {
      console.warn(`[REGISTRATION REJECTED] Duplicate Team Name: ${cleanTeamName}`);
      return res.status(409).json({
        success: false,
        message: `A team named "${cleanTeamName}" already exists. Please choose a different team name.`,
      });
    }

    const existingPhone = await TeamRegistration.findOne({
      $or: [{ leaderPhone: cleanLeaderPhone }, { 'members.phone': cleanLeaderPhone }],
    });

    if (existingPhone) {
      console.warn(`[REGISTRATION REJECTED] Duplicate Phone Number: ${cleanLeaderPhone}`);
      return res.status(409).json({
        success: false,
        message: `The phone number "${cleanLeaderPhone}" is already registered.`,
      });
    }

    // Validate members count (Leader + 2 to 4 members = 3 to 5 total members)
    if (!members || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A team must contain at least 3 members (Leader + 2 members).',
      });
    }

    if (members.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Maximum team size is 5 members (Leader + 4 members).',
      });
    }

    // Auto-generate Team ID (e.g. HS2026-001)
    const count = await TeamRegistration.countDocuments();
    const nextNum = (count + 1).toString().padStart(3, '0');
    const teamId = `HS2026-${nextNum}`;

    const newRegistration = new TeamRegistration({
      teamId,
      clerkId: clerkId || '',
      teamName: cleanTeamName,
      leaderName: leaderName.trim(),
      leaderEmail: cleanLeaderEmail,
      leaderPhone: cleanLeaderPhone,
      collegeName: collegeName.trim(),
      course: (course || '').trim(),
      branch: (branch || '').trim(),
      year: (year || '').trim(),
      city: (city || '').trim(),
      state: (state || '').trim(),
      members: members || [],
      status: 'Verified',
    });

    const savedTeam = await newRegistration.save();

    // Verify the document was actually saved in MongoDB
    const verifiedDoc = await TeamRegistration.findById(savedTeam._id);
    if (!verifiedDoc) {
      throw new Error('Failed to verify document creation in MongoDB.');
    }

    console.log('[REGISTRATION SAVED SUCCESSFULLY]');
    console.log(`[MONGODB DOC ID] Mongo _id: ${savedTeam._id} | Generated teamId: ${savedTeam.teamId}`);
    console.log('--------------------------------------------------\n');

    // Broadcast new registration via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.emit('new_registration', savedTeam);
      io.emit('registration_created', savedTeam);
    }

    return res.status(201).json({
      success: true,
      message: 'Team registered successfully and saved to MongoDB.',
      data: savedTeam,
    });
  } catch (error) {
    console.error('[REGISTRATION ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during team registration.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations from MongoDB
router.get('/', async (req, res) => {
  try {
    const { search, college, sort = 'newest' } = req.query;
    console.log(`[FETCH REQUEST RECEIVED] Search: "${search || ''}", College: "${college || 'All'}", Sort: "${sort}"`);

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { teamId: searchRegex },
        { teamName: searchRegex },
        { leaderName: searchRegex },
        { collegeName: searchRegex },
        { leaderEmail: searchRegex },
        { leaderPhone: searchRegex },
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

    console.log(`[COUNT RETURNED] Found ${teams.length} registrations in MongoDB.`);

    return res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    console.error('[FETCH ERROR] Failed to fetch registrations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team registrations from MongoDB.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations/check/:targetId
// @desc    Check if a Clerk user or email is already registered
router.get('/check/:targetId', async (req, res) => {
  try {
    const { targetId } = req.params;
    const { email } = req.query;

    const searchEmail = email ? email.toLowerCase().trim() : '';
    const searchClerkId = targetId && targetId !== 'unauthenticated' ? targetId.trim() : '';

    let query = { $or: [] };
    if (searchClerkId) query.$or.push({ clerkId: searchClerkId });
    if (searchEmail) {
      query.$or.push({ leaderEmail: searchEmail });
      query.$or.push({ 'members.email': searchEmail });
    }

    if (query.$or.length === 0) {
      return res.status(200).json({ registered: false });
    }

    const team = await TeamRegistration.findOne(query);

    if (team) {
      return res.status(200).json({
        registered: true,
        message: 'Already registered in a team.',
        data: team,
      });
    }

    return res.status(200).json({ registered: false });
  } catch (error) {
    console.error('[CHECK REGISTRATION ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/registrations/my-team
// @desc    Get single team registration by user email
router.get('/my-team', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required.' });
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

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('[MY-TEAM FETCH ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team information.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations/stats
// @desc    Get registration analytics directly from MongoDB
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

    return res.status(200).json({
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
    console.error('[STATS ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch registration statistics.',
      error: error.message,
    });
  }
});

// @route   GET /api/registrations/:id
// @desc    Get single registration by Mongo _id or teamId
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await TeamRegistration.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Registration document not found.' });
    }

    return res.status(200).json({ success: true, data: team });
  } catch (error) {
    console.error('[GET SINGLE REGISTRATION ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
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

    const io = req.app.get('io');
    if (io) {
      io.emit('registration_updated', updatedTeam);
    }

    return res.status(200).json({
      success: true,
      message: `Team status updated to ${status}`,
      data: updatedTeam,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update team status', error: error.message });
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

    const io = req.app.get('io');
    if (io) {
      io.emit('registration_updated', updatedTeam);
    }

    return res.status(200).json({
      success: true,
      message: 'Team registration details updated successfully',
      data: updatedTeam,
    });
  } catch (error) {
    console.error('Update Team Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update team details', error: error.message });
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

    const io = req.app.get('io');
    if (io) {
      io.emit('registration_deleted', { id: deletedTeam._id, teamId: deletedTeam.teamId });
    }

    return res.status(200).json({
      success: true,
      message: 'Team registration deleted successfully',
      data: deletedTeam,
    });
  } catch (error) {
    console.error('Delete Team Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete team registration', error: error.message });
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

    const io = req.app.get('io');
    if (io) {
      io.emit('registration_updated', { bulk: true, ids, status });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${ids.length} teams to ${status}`,
    });
  } catch (error) {
    console.error('Bulk Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to perform bulk status update', error: error.message });
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

    const io = req.app.get('io');
    if (io) {
      io.emit('registration_deleted', { bulk: true, ids });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} teams`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to perform bulk deletion', error: error.message });
  }
});

module.exports = router;
