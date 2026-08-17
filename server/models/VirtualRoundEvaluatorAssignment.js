const mongoose = require('mongoose');

const virtualRoundEvaluatorAssignmentSchema = new mongoose.Schema(
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
      default: '',
      trim: true,
    },
    evaluatorName: {
      type: String,
      default: '',
      trim: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    assignedBy: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VirtualRoundEvaluatorAssignment', virtualRoundEvaluatorAssignmentSchema);
