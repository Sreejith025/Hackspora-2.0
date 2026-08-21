const mongoose = require('mongoose');

const virtualSubmissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    problemStatementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProblemStatement',
    },
    problemStatementName: {
      type: String,
      required: true,
      trim: true,
    },
    githubLink: {
      type: String,
      required: true,
      trim: true,
    },
    videoLink: {
      type: String,
      required: true,
      trim: true,
    },
    pptLink: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisted', 'rejected'],
      default: 'submitted',
      index: true,
    },
    evaluatorName: {
      type: String,
      default: null,
      trim: true,
    },
    mentorLink: {
      type: String,
      default: '',
      trim: true,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    assignedBy: {
      type: String,
      default: null,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
      default: '',
    },
    reviewNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VirtualSubmission', virtualSubmissionSchema);
