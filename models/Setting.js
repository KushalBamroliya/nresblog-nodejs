const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  websiteTitle: {
    type: String,
    trim: true,
    required: true,
  },
  websiteLogo: {
    type: String,
  },
  footerDesctioption: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
