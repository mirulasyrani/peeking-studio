const express = require("express");
const router = express.Router();
const { getProjects, getImagesByProject } = require("../controllers/galleryController");

const validate = require("../middleware/validate");
const { projectParamSchema } = require("../validators/gallerySchema"); // <-- You'll create this

// Get all projects
router.get("/projects", getProjects);

// Get images for a specific project (folder)
router.get("/images/:project", validate(projectParamSchema, 'params'), getImagesByProject);

module.exports = router;
