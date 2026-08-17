const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: '' },
  github: { type: String, default: '' },
  collegeName: { type: String, default: '' },
  course: { type: String, default: '' },
  branch: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
});

const teamRegistrationSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    clerkId: {
      type: String,
      default: '',
      index: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderName: {
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
    leaderPhone: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      default: 'B.Tech',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    github: {
      type: String,
      default: '',
      trim: true,
    },
    videoLink: {
      type: String,
      default: '',
      trim: true,
    },
    paymentStatus: {
      type: String,
      default: 'Completed',
      trim: true,
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    status: {
      type: String,
      default: 'Verified',
      enum: ['Verified', 'Pending', 'Rejected'],
    },
    evaluatorName: {
      type: String,
      default: '',
      trim: true,
    },
    evaluatorAssignedAt: {
      type: Date,
      default: null,
    },
    evaluatorAssignedBy: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper static method to generate next unique teamId (e.g. HS2026-015)
teamRegistrationSchema.statics.generateUniqueTeamId = async function () {
  const existingTeams = await this.find({ teamId: { $regex: /^HS2026-\d+$/ } }, { teamId: 1 }).lean();

  let maxNum = 0;
  existingTeams.forEach((t) => {
    if (t.teamId) {
      const match = t.teamId.match(/^HS2026-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  });

  let nextNum = maxNum + 1;
  let candidate = `HS2026-${nextNum.toString().padStart(3, '0')}`;

  while (await this.exists({ teamId: candidate })) {
    nextNum++;
    candidate = `HS2026-${nextNum.toString().padStart(3, '0')}`;
  }

  return candidate;
};

// Auto-generate Team ID if not provided before saving
teamRegistrationSchema.pre('validate', async function () {
  if (!this.teamId) {
    const TeamModel = this.constructor;
    this.teamId = await TeamModel.generateUniqueTeamId();
  }
});

module.exports = mongoose.model('TeamRegistration', teamRegistrationSchema);
