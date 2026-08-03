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
    members: {
      type: [memberSchema],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 2 && val.length <= 4;
        },
        message: 'A team must contain between 3 and 5 members in total (Leader + 2 to 4 additional members).',
      },
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
