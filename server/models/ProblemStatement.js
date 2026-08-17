const mongoose = require('mongoose');

const problemStatementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['published', 'unpublished', 'draft'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProblemStatement', problemStatementSchema);
