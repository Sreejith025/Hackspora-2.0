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
  },
  {
    timestamps: true,
  }
);

// Auto-generate Team ID if not provided before saving
teamRegistrationSchema.pre('validate', async function () {
  if (!this.teamId) {
    const count = await mongoose.model('TeamRegistration').countDocuments();
    const nextNum = (count + 1).toString().padStart(3, '0');
    this.teamId = `HS2026-${nextNum}`;
  }
});

module.exports = mongoose.model('TeamRegistration', teamRegistrationSchema);
