const fs = require("fs");
const path = require("path");

// Route 1: GET /api/gallery/projects
exports.getProjects = (req, res) => {
  const baseDir = path.join(__dirname, "..", "uploads", "gallery");

  try {
    const projects = fs.readdirSync(baseDir).filter((name) => {
      const dir = path.join(baseDir, name);
      return fs.statSync(dir).isDirectory();
    });

    const result = projects.map((project) => {
      const projectPath = path.join(baseDir, project);

      // Find first image file for thumbnail
      const images = fs.readdirSync(projectPath).filter((f) =>
        /\.(jpe?g|png)$/i.test(f)
      );
      const thumbnail = images[0]
        ? `/uploads/gallery/${project}/${images[0]}`
        : null;

      // Read description.txt (optional)
      let description = "";
      const descPath = path.join(projectPath, "description.txt");
      if (fs.existsSync(descPath)) {
        description = fs.readFileSync(descPath, "utf-8").trim();
      }

      // Read tags.txt (optional)
      let tags = [];
      const tagsPath = path.join(projectPath, "tags.txt");
      if (fs.existsSync(tagsPath)) {
        tags = fs
          .readFileSync(tagsPath, "utf-8")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // Get folder creation date
      const uploadDate = fs.statSync(projectPath).birthtime;

      return {
        project,
        thumbnail,
        description,
        tags,
        uploadDate,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Failed to load projects." });
  }
};

// Route 2: GET /api/gallery/images/:project
exports.getImagesByProject = (req, res) => {
  const project = req.params.project;
  const projectDir = path.join(__dirname, "..", "uploads", "gallery", project);

  try {
    if (!fs.existsSync(projectDir)) {
      return res.status(404).json({ message: "Project not found" });
    }

    const images = fs.readdirSync(projectDir).filter((file) =>
      /\.(jpe?g|png)$/i.test(file)
    );

    const imageUrls = images.map(
      (img) => `/uploads/gallery/${project}/${img}`
    );

    res.json({ project, images: imageUrls });
  } catch (err) {
    console.error("getImagesByProject error:", err);
    res.status(500).json({ message: "Failed to load images." });
  }
};
