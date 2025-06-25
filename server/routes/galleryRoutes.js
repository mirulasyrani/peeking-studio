const express = require("express");
const router = express.Router();
const {
  getProjects,
  getImagesByProject,
} = require("../controllers/galleryController");

router.get("/projects", getProjects);
router.get("/images/:project", getImagesByProject);

module.exports = router;
