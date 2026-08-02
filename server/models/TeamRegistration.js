const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  github: { type: String, default: '' },
  collegeName: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const teamRegistrationSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
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
    },
    collegeName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    members: [memberSchema],
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
