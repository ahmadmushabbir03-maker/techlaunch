const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    requiredLevel: { type: Number, default: 80 },
    userLevel: { type: Number, default: 0 },
    market: {
      type: String,
      enum: ["India", "Toronto", "Both"],
      default: "Both"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
