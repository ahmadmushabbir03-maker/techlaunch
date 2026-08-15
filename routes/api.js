const express = require("express");

const Skill = require("../models/skill");
const Project = require("../models/project");
const Job = require("../models/job");

const router = express.Router();

router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ userLevel: -1 });
    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve skills"
    });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve projects"
    });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ matchScore: -1 });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve jobs"
    });
  }
});

router.get("/health", async (req, res) => {
  const mongoose = require("mongoose");

  const databaseHealthy =
    mongoose.connection.readyState === 1;

  const payload = {
    status: databaseHealthy ? "healthy" : "degraded",
    application: process.env.APP_NAME || "TechLaunch",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: databaseHealthy ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  };

  res.status(databaseHealthy ? 200 : 503).json(payload);
});

module.exports = router;
