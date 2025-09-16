const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  org: { type: String },
  description: { type: String },
  month: { type: String },
  year: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Achievement", achievementSchema);
