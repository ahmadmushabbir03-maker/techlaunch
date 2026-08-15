var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", {
    title: "Dashboard"
  });
});

router.get("/career", function(req, res) {
  res.render("career", {
    title: "Career & Jobs"
  });
});

router.get("/projects", function(req, res) {
  res.render("projects", {
    title: "Projects & Deployment"
  });
});

router.get("/badges", function(req, res) {
  res.render("badges", {
    title: "Badges & Achievements"
  });
});

router.get("/architecture", function(req, res) {
  res.render("architecture", {
    title: "Architecture & CI/CD"
  });
});

router.get("/pricing", function(req, res) {
  res.render("pricing", {
    title: "Pricing"
  });
});

module.exports = router;
