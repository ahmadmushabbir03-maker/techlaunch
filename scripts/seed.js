require("dotenv").config();

const mongoose = require("mongoose");

const Skill = require("../models/skill");
const Project = require("../models/project");
const Job = require("../models/job");

const uri =
  process.env.AZURE_COSMOS_CONNECTIONSTRING ||
  process.env.MONGODB_URI;

const skills = [
  {
    name: "Azure",
    category: "Cloud",
    requiredLevel: 85,
    userLevel: 88,
    market: "Both"
  },
  {
    name: "Jenkins",
    category: "DevOps",
    requiredLevel: 85,
    userLevel: 90,
    market: "Both"
  },
  {
    name: "Terraform",
    category: "Infrastructure",
    requiredLevel: 85,
    userLevel: 72,
    market: "Both"
  },
  {
    name: "Docker",
    category: "Containers",
    requiredLevel: 80,
    userLevel: 68,
    market: "Both"
  },
  {
    name: "Kubernetes",
    category: "Containers",
    requiredLevel: 80,
    userLevel: 55,
    market: "Both"
  },
  {
    name: "Node.js",
    category: "Backend",
    requiredLevel: 80,
    userLevel: 84,
    market: "Both"
  },
  {
    name: "MongoDB",
    category: "Database",
    requiredLevel: 75,
    userLevel: 82,
    market: "Both"
  }
];

const projects = [
  {
    name: "Azure Node.js Deployment",
    description:
      "Node.js and MongoDB application deployed to Azure App Service using Jenkins and Terraform.",
    technologies: [
      "Node.js",
      "MongoDB",
      "Azure",
      "Jenkins",
      "Terraform"
    ],
    completion: 100,
    status: "deployed"
  },
  {
    name: "Cloud Infrastructure",
    description:
      "Infrastructure as Code implementation for Azure cloud resources.",
    technologies: ["Terraform", "Azure", "IaC"],
    completion: 90,
    status: "deployed"
  },
  {
    name: "CI/CD Automation",
    description:
      "Automated application build, testing, packaging and deployment.",
    technologies: ["Jenkins", "CI/CD", "GitHub"],
    completion: 75,
    status: "building"
  }
];

const jobs = [
  {
    title: "DevOps Engineer",
    company: "Cloud Technologies",
    location: "Toronto, Canada",
    market: "Toronto",
    experience: "Entry Level",
    skills: ["Azure", "Terraform", "Jenkins"],
    matchScore: 86
  },
  {
    title: "Cloud Engineer",
    company: "Digital Systems",
    location: "Toronto, Canada",
    market: "Toronto",
    experience: "Entry Level",
    skills: ["Azure", "Docker", "Kubernetes"],
    matchScore: 79
  },
  {
    title: "DevOps Engineer",
    company: "Technology Solutions",
    location: "Bengaluru, India",
    market: "India",
    experience: "Entry Level",
    skills: ["Azure", "Jenkins", "Docker"],
    matchScore: 84
  },
  {
    title: "Cloud Engineer",
    company: "Enterprise Cloud",
    location: "Hyderabad, India",
    market: "India",
    experience: "Entry Level",
    skills: ["Cloud", "Terraform", "Linux"],
    matchScore: 77
  }
];

async function seed() {
  try {
    await mongoose.connect(uri);

    console.log("Connected to MongoDB");

    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Job.deleteMany({});

    await Skill.insertMany(skills);
    await Project.insertMany(projects);
    await Job.insertMany(jobs);

    console.log("Skills seeded:", skills.length);
    console.log("Projects seeded:", projects.length);
    console.log("Jobs seeded:", jobs.length);

    await mongoose.disconnect();

    console.log("Database seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
