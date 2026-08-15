const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    market: {
      type: String,
      enum: ["India", "Toronto"],
      required: true
    },
    experience: { type: String, default: "Entry Level" },
    skills: [{ type: String }],
    matchScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
