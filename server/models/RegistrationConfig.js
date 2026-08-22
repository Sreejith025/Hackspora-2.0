const mongoose = require('mongoose');

const registrationConfigSchema = new mongoose.Schema(
  {
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Helper static method to get or create singleton config
registrationConfigSchema.statics.getSingletonConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('RegistrationConfig', registrationConfigSchema);
