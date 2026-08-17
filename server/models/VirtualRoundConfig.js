const mongoose = require('mongoose');

const virtualRoundConfigSchema = new mongoose.Schema(
  {
    isRoundActive: {
      type: Boolean,
      default: true,
    },
    isAcceptingSubmissions: {
      type: Boolean,
      default: true,
    },
    roundName: {
      type: String,
      default: 'Hackspora 2.0 Virtual Round',
    },
    submissionDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
    },
    guidelines: {
      type: [String],
      default: [
        'Each team must submit a GitHub repository containing clean, documented code and a descriptive README.md.',
        'Submit a 3 to 5 minute video demonstration showcasing your project architecture, features, and live execution.',
        'Presentation slides must be uploaded in .ppt or .pptx format summarizing the problem, solution, technology stack, and future scope.',
        'Only team leaders or registered team members may submit the project on behalf of their team.',
        'Resubmissions or modifications are locked once the submission is under review.',
      ],
    },
    eligibleTeamIds: {
      type: [String],
      default: [],
    },
    allVerifiedEligible: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

virtualRoundConfigSchema.virtual('submissionOpen').get(function () {
  return this.isAcceptingSubmissions;
}).set(function (val) {
  this.isAcceptingSubmissions = Boolean(val);
});

virtualRoundConfigSchema.set('toObject', { virtuals: true });
virtualRoundConfigSchema.set('toJSON', { virtuals: true });

// Helper static method to get or create singleton config
virtualRoundConfigSchema.statics.getSingletonConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('VirtualRoundConfig', virtualRoundConfigSchema);
