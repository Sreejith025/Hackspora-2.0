const express = require('express');
const router = express.Router();

const TeamRegistration = require('../models/TeamRegistration');
const VirtualSubmission = require('../models/VirtualSubmission');
const VirtualRoundConfig = require('../models/VirtualRoundConfig');
const ProblemStatement = require('../models/ProblemStatement');
const VirtualRoundEvaluatorAssignment = require('../models/VirtualRoundEvaluatorAssignment');

// Helper URL Validators
const isValidUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidGithubUrl = (urlStr) => {
  if (!isValidUrl(urlStr)) return false;
  return urlStr.toLowerCase().includes('github.com');
};

const ADMIN_EMAIL = 'abisri024@gmail.com';

// Middleware to check admin authorization
const verifyAdminAccess = (req, res, next) => {
  const adminEmailHeader = req.headers['x-admin-email'] || req.query.adminEmail || req.body?.adminEmail;
  if (adminEmailHeader && typeof adminEmailHeader === 'string' && adminEmailHeader.trim()) {
    req.adminEmail = adminEmailHeader.toLowerCase().trim();
  } else {
    req.adminEmail = ADMIN_EMAIL;
  }
  next();
};

// ==========================================
// PUBLIC & PARTICIPANT ENDPOINTS
// ==========================================

// @route   GET /api/virtual-round/config
// @desc    Get Virtual Round configuration, active state, guidelines, and metrics
router.get('/config', async (req, res) => {
  try {
    const config = await VirtualRoundConfig.getSingletonConfig();
    const totalSubmissions = await VirtualSubmission.countDocuments();
    const shortlistedCount = await VirtualSubmission.countDocuments({ status: 'shortlisted' });
    const eligibleTeamsCount = await TeamRegistration.countDocuments({ status: 'Verified' });

    res.json({
      success: true,
      submissionOpen: config.isAcceptingSubmissions,
      data: {
        ...config.toObject(),
        submissionOpen: config.isAcceptingSubmissions,
        metrics: {
          totalEligibleTeams: eligibleTeamsCount,
          totalSubmissions,
          shortlistedCount,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching Virtual Round config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/virtual-round/my-submission
// @desc    Get submission details for authenticated user's team
router.get('/my-submission', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email query is required.' });
    }

    const userEmail = email.toLowerCase().trim();

    // Derive team from backend database (never trust teamId sent directly)
    const team = await TeamRegistration.findOne({
      $or: [{ leaderEmail: userEmail }, { 'members.email': userEmail }],
    });

    if (!team) {
      return res.json({
        success: true,
        registered: false,
        isEligible: false,
        virtualRoundStatus: 'registered',
        message: 'No team registration found.',
      });
    }

    const config = await VirtualRoundConfig.getSingletonConfig();

    // Determine eligibility: team status must be Verified, and either allVerifiedEligible or listed in eligibleTeamIds
    let isEligible = team.status === 'Verified';
    if (config.eligibleTeamIds && config.eligibleTeamIds.length > 0 && !config.allVerifiedEligible) {
      isEligible = isEligible && config.eligibleTeamIds.includes(team.teamId);
    }

    // Check if team has already submitted
    const submission = await VirtualSubmission.findOne({ teamId: team.teamId });
    const evalAssignment = await VirtualRoundEvaluatorAssignment.findOne({ teamId: team.teamId });
    const assignedEvaluatorName = evalAssignment?.evaluatorName || team.evaluatorName || null;
    const assignedEvaluatorAt = evalAssignment?.assignedAt || team.evaluatorAssignedAt || null;

    let virtualRoundStatus = 'registered';
    if (submission) {
      virtualRoundStatus = submission.status; // 'submitted', 'under_review', 'shortlisted', 'rejected'
    } else if (isEligible) {
      virtualRoundStatus = config.isRoundActive && config.isAcceptingSubmissions ? 'active' : 'eligible';
    }

    res.json({
      success: true,
      registered: true,
      isEligible,
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        collegeName: team.collegeName,
        evaluatorName: assignedEvaluatorName,
        evaluatorAssignedAt: assignedEvaluatorAt,
      },
      virtualRoundStatus,
      submission: submission || null,
      config: {
        isRoundActive: config.isRoundActive,
        isAcceptingSubmissions: config.isAcceptingSubmissions,
        submissionDeadline: config.submissionDeadline,
      },
    });
  } catch (error) {
    console.error('Get My Submission Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/virtual-round/submit
// @desc    Submit Virtual Round project links (githubLink, videoLink, pptLink)
router.post('/submit', async (req, res) => {
  try {
    const { userEmail, problemStatementId, problemStatementName, githubLink, videoLink, pptLink } = req.body;

    if (!userEmail || !userEmail.trim()) {
      return res.status(400).json({ success: false, message: 'Authentication email is required.' });
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    // 1. Verify User belongs to a Team (Derive team on backend)
    const team = await TeamRegistration.findOne({
      $or: [{ leaderEmail: normalizedEmail }, { 'members.email': normalizedEmail }],
    });

    if (!team) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered in any team. Only registered teams can submit for Virtual Round.',
      });
    }

    // 2. Check Virtual Round is active & accepting submissions
    const config = await VirtualRoundConfig.getSingletonConfig();
    if (!config.isRoundActive) {
      return res.status(403).json({
        success: false,
        message: 'Virtual Round is currently inactive. Submissions are not open.',
      });
    }
    if (!config.isAcceptingSubmissions) {
      return res.status(403).json({
        success: false,
        message: 'Virtual Round submissions are currently closed.',
      });
    }

    // 2b. Check Deadline
    if (config.submissionDeadline && new Date() > new Date(config.submissionDeadline)) {
      return res.status(403).json({
        success: false,
        message: 'Virtual Round submission deadline has passed.',
      });
    }

    // 3. Verify Team Eligibility
    let isEligible = team.status === 'Verified';
    if (config.eligibleTeamIds && config.eligibleTeamIds.length > 0 && !config.allVerifiedEligible) {
      isEligible = isEligible && config.eligibleTeamIds.includes(team.teamId);
    }

    if (!isEligible) {
      return res.status(400).json({
        success: false,
        message: 'Your team is not eligible for the Virtual Round submission.',
      });
    }

    // 4. Verify Team has not already submitted (Backend check)
    const existingSubmission = await VirtualSubmission.findOne({ teamId: team.teamId });
    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'This team has already submitted.',
      });
    }

    // 5. Input Validation for URLs
    if (!githubLink || !isValidGithubUrl(githubLink) || !videoLink || !isValidUrl(videoLink) || !pptLink || !isValidUrl(pptLink)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid submission links.',
      });
    }

    // 6. Problem Statement Verification against MongoDB
    let psRecord = null;
    if (problemStatementId) {
      psRecord = await ProblemStatement.findById(problemStatementId);
    }
    if (!psRecord && problemStatementName) {
      psRecord = await ProblemStatement.findOne({ name: problemStatementName.trim() });
    }

    if (!psRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem statement.',
      });
    }

    if (psRecord.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This problem statement is no longer available.',
      });
    }

    // Fetch pre-assigned evaluator from VirtualRoundEvaluatorAssignment
    const evalAssignment = await VirtualRoundEvaluatorAssignment.findOne({ teamId: team.teamId });
    const assignedEvaluatorName = evalAssignment?.evaluatorName || team.evaluatorName || null;
    const assignedEvaluatorAt = evalAssignment?.assignedAt || team.evaluatorAssignedAt || null;
    const assignedEvaluatorBy = evalAssignment?.assignedBy || team.evaluatorAssignedBy || null;

    // Create new Virtual Submission
    const newSubmission = new VirtualSubmission({
      teamId: team.teamId,
      teamName: team.teamName,
      leaderEmail: team.leaderEmail,
      problemStatementId: psRecord._id,
      problemStatementName: psRecord.name,
      githubLink: githubLink.trim(),
      videoLink: videoLink.trim(),
      pptLink: pptLink.trim(),
      status: 'submitted',
      evaluatorName: assignedEvaluatorName,
      assignedAt: assignedEvaluatorAt,
      assignedBy: assignedEvaluatorBy,
      submittedAt: new Date(),
    });

    const savedSubmission = await newSubmission.save();

    return res.status(201).json({
      success: true,
      message: 'Project submitted successfully for Virtual Round!',
      data: savedSubmission,
      submission: savedSubmission,
    });
  } catch (error) {
    console.error('Virtual Submission Error:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This team has already submitted.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting project.',
    });
  }
});

// @route   GET /api/virtual-round/public-results
// @desc    Get public list of shortlisted teams ONLY (Rejected status is strictly hidden)
router.get('/public-results', async (req, res) => {
  try {
    const shortlistedSubmissions = await VirtualSubmission.find({ status: 'shortlisted' }).sort({ updatedAt: -1 });

    const teamIds = shortlistedSubmissions.map((s) => s.teamId);
    const teams = await TeamRegistration.find({ teamId: { $in: teamIds } }).lean();
    const teamMap = new Map(teams.map((t) => [t.teamId, t]));

    const publicList = shortlistedSubmissions.map((sub) => {
      const teamInfo = teamMap.get(sub.teamId);
      return {
        teamId: sub.teamId,
        teamName: sub.teamName,
        collegeName: teamInfo?.collegeName || 'N/A',
        leaderName: teamInfo?.leaderName || 'Team Leader',
        problemStatementName: sub.problemStatementName,
        status: 'Shortlisted',
        shortlistedAt: sub.reviewedAt || sub.updatedAt,
      };
    });

    res.json({
      success: true,
      count: publicList.length,
      data: publicList,
    });
  } catch (error) {
    console.error('Error fetching public shortlisted results:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN CONTROL & MANAGEMENT ENDPOINTS
// ==========================================

// @route   GET /api/virtual-round/admin/submissions
// @desc    Get all submissions for Admin review
router.get('/admin/submissions', verifyAdminAccess, async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { teamId: searchRegex },
        { teamName: searchRegex },
        { problemStatementName: searchRegex },
        { leaderEmail: searchRegex },
        { evaluatorName: searchRegex },
      ];
    }

    const submissions = await VirtualSubmission.find(query).sort({ createdAt: -1 });

    // Attach college name from TeamRegistration
    const teamIds = submissions.map((s) => s.teamId);
    const teams = await TeamRegistration.find({ teamId: { $in: teamIds } }).lean();
    const teamMap = new Map(teams.map((t) => [t.teamId, t]));

    const enrichedSubmissions = submissions.map((sub) => {
      const t = teamMap.get(sub.teamId);
      return {
        ...sub.toObject(),
        collegeName: t?.collegeName || 'N/A',
        membersCount: t ? 1 + (t.members ? t.members.length : 0) : 1,
      };
    });

    res.json({
      success: true,
      count: enrichedSubmissions.length,
      data: enrichedSubmissions,
    });
  } catch (error) {
    console.error('Admin Fetch Submissions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH or PUT /api/virtual-round/admin/submissions/:id/evaluator
// @desc    Admin endpoint to assign, change, or remove an evaluator for a submission
const handleAssignEvaluator = async (req, res) => {
  try {
    const { id } = req.params;
    const { evaluatorName } = req.body;

    const submission = await VirtualSubmission.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Virtual Round Submission not found.' });
    }

    let successMessage = '';

    if (evaluatorName && typeof evaluatorName === 'string' && evaluatorName.trim().length > 0) {
      submission.evaluatorName = evaluatorName.trim();
      submission.assignedAt = new Date();
      submission.assignedBy = req.adminEmail || ADMIN_EMAIL;
      successMessage = `Evaluator '${submission.evaluatorName}' assigned successfully.`;
    } else {
      // Remove evaluator if empty string or null passed
      submission.evaluatorName = null;
      submission.assignedAt = null;
      submission.assignedBy = null;
      successMessage = 'Evaluator removed successfully.';
    }

    const updatedSubmission = await submission.save();

    return res.json({
      success: true,
      message: successMessage,
      submission: updatedSubmission,
      data: updatedSubmission,
    });
  } catch (error) {
    console.error('Admin Assign Evaluator Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.patch('/admin/submissions/:id/evaluator', verifyAdminAccess, handleAssignEvaluator);
router.put('/admin/submissions/:id/evaluator', verifyAdminAccess, handleAssignEvaluator);

// @route   PUT /api/virtual-round/admin/submissions/:id/status
// @desc    Admin action: Update submission status (under_review, shortlisted, rejected)
router.put('/admin/submissions/:id/status', verifyAdminAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminEmail } = req.body;

    const allowedStatuses = ['submitted', 'under_review', 'shortlisted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const submission = await VirtualSubmission.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { teamId: id }],
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Virtual Round Submission not found.' });
    }

    submission.status = status;
    submission.reviewedAt = new Date();
    submission.reviewedBy = adminEmail || ADMIN_EMAIL;

    const updatedSubmission = await submission.save();

    res.json({
      success: true,
      message: `Submission status updated to '${status}' successfully.`,
      submission: updatedSubmission,
      data: updatedSubmission,
    });
  } catch (error) {
    console.error('Admin Update Submission Status Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/virtual-round/submission-status
// @desc    Admin action: Lock or Open Virtual Round submissions
router.put('/submission-status', verifyAdminAccess, async (req, res) => {
  try {
    const { submissionOpen, isAcceptingSubmissions } = req.body;

    const targetState = typeof submissionOpen === 'boolean'
      ? submissionOpen
      : typeof isAcceptingSubmissions === 'boolean'
      ? isAcceptingSubmissions
      : null;

    if (targetState === null) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission status parameter. Expected submissionOpen: true or false.',
      });
    }

    const config = await VirtualRoundConfig.getSingletonConfig();
    config.isAcceptingSubmissions = targetState;
    config.updatedBy = req.adminEmail || ADMIN_EMAIL;
    const updatedConfig = await config.save();

    res.json({
      success: true,
      message: `Virtual Round submissions are now ${targetState ? 'OPEN' : 'LOCKED'}.`,
      submissionOpen: updatedConfig.isAcceptingSubmissions,
      data: updatedConfig,
    });
  } catch (error) {
    console.error('Admin Update Submission Status Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/virtual-round/admin/config
// @desc    Admin control: Release/Start round, Open/Close submissions, update deadline or guidelines
router.put('/admin/config', verifyAdminAccess, async (req, res) => {
  try {
    const { isRoundActive, isAcceptingSubmissions, submissionOpen, submissionDeadline, roundName, guidelines, allVerifiedEligible } =
      req.body;

    const config = await VirtualRoundConfig.getSingletonConfig();

    if (typeof isRoundActive === 'boolean') config.isRoundActive = isRoundActive;
    if (typeof isAcceptingSubmissions === 'boolean') config.isAcceptingSubmissions = isAcceptingSubmissions;
    if (typeof submissionOpen === 'boolean') config.isAcceptingSubmissions = submissionOpen;
    if (typeof allVerifiedEligible === 'boolean') config.allVerifiedEligible = allVerifiedEligible;
    if (submissionDeadline) config.submissionDeadline = new Date(submissionDeadline);
    if (roundName) config.roundName = roundName;
    if (Array.isArray(guidelines)) config.guidelines = guidelines;

    config.updatedBy = req.adminEmail || ADMIN_EMAIL;

    const updatedConfig = await config.save();

    res.json({
      success: true,
      message: 'Virtual Round configuration updated successfully.',
      submissionOpen: updatedConfig.isAcceptingSubmissions,
      data: updatedConfig,
    });
  } catch (error) {
    console.error('Admin Update Config Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/virtual-round/admin/stats
// @desc    Get Virtual Round metrics (Total eligible, Total submissions, Under review, Shortlisted, Rejected)
router.get('/admin/stats', verifyAdminAccess, async (req, res) => {
  try {
    const totalEligibleTeams = await TeamRegistration.countDocuments({ status: 'Verified' });
    const totalSubmissions = await VirtualSubmission.countDocuments();
    const underReviewCount = await VirtualSubmission.countDocuments({ status: 'under_review' });
    const shortlistedCount = await VirtualSubmission.countDocuments({ status: 'shortlisted' });
    const rejectedCount = await VirtualSubmission.countDocuments({ status: 'rejected' });
    res.json({
      success: true,
      data: {
        totalEligibleTeams,
        totalSubmissions,
        underReviewCount,
        shortlistedCount,
        rejectedCount,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// @route   GET /api/virtual-round/admin/teams-evaluators
// @desc    Get all registered teams with pre-assigned evaluator details from VirtualRoundEvaluatorAssignment
router.get('/admin/teams-evaluators', verifyAdminAccess, async (req, res) => {
  try {
    const teams = await TeamRegistration.find().sort({ createdAt: -1 }).lean();
    const assignments = await VirtualRoundEvaluatorAssignment.find().lean();

    const assignmentMap = {};
    assignments.forEach((a) => {
      assignmentMap[a.teamId] = a;
    });

    res.json({
      success: true,
      data: teams.map((t) => {
        const assign = assignmentMap[t.teamId];
        return {
          _id: t._id,
          teamId: t.teamId,
          teamName: t.teamName,
          leaderName: t.leaderName,
          leaderEmail: t.leaderEmail,
          collegeName: t.collegeName,
          status: t.status,
          evaluatorName: assign?.evaluatorName || t.evaluatorName || '',
          evaluatorAssignedAt: assign?.assignedAt || t.evaluatorAssignedAt || null,
          evaluatorAssignedBy: assign?.assignedBy || t.evaluatorAssignedBy || '',
        };
      }),
    });
  } catch (error) {
    console.error('Admin Get Teams Evaluators Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/virtual-round/admin/teams/:teamId/evaluator
// @desc    Pre-assign, change, or remove evaluator for a team in VirtualRoundEvaluatorAssignment and sync VirtualSubmission
router.patch('/admin/teams/:teamId/evaluator', verifyAdminAccess, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { evaluatorName } = req.body;
    const adminEmail = req.adminEmail || ADMIN_EMAIL;

    const team = await TeamRegistration.findOne({
      $or: [{ teamId }, { _id: teamId.match(/^[0-9a-fA-F]{24}$/) ? teamId : null }],
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    const assignedName = evaluatorName && typeof evaluatorName === 'string' ? evaluatorName.trim() : '';

    const assignment = await VirtualRoundEvaluatorAssignment.findOneAndUpdate(
      { teamId: team.teamId },
      {
        teamName: team.teamName,
        evaluatorName: assignedName,
        assignedAt: assignedName ? new Date() : null,
        assignedBy: assignedName ? adminEmail : '',
      },
      { upsert: true, new: true }
    );

    // If VirtualSubmission exists for this team, update evaluator details on submission too
    const submission = await VirtualSubmission.findOne({ teamId: team.teamId });
    if (submission) {
      submission.evaluatorName = assignedName || null;
      submission.assignedAt = assignment.assignedAt;
      submission.assignedBy = assignment.assignedBy || null;
      await submission.save();
    }

    res.json({
      success: true,
      message: assignedName
        ? `Evaluator '${assignedName}' pre-assigned to team ${team.teamName}.`
        : `Evaluator removed from team ${team.teamName}.`,
      data: {
        ...team.toObject(),
        evaluatorName: assignment.evaluatorName,
        evaluatorAssignedAt: assignment.assignedAt,
        evaluatorAssignedBy: assignment.assignedBy,
      },
    });
  } catch (error) {
    console.error('Admin Pre-assign Evaluator Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
