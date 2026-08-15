const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    completion: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["planning", "building", "deployed"],
      default: "planning"
    },
    githubUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
