const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../db");

// Save image metadata to PostgreSQL
const saveImageMeta = async (image) => {
  const { project, filename, filePath } = image;
  await db.query(
    "INSERT INTO gallery_images (project, filename, path) VALUES ($1, $2, $3)",
    [project, filename, filePath]
  );
};

// Setup dynamic storage with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const project = req.body.project;
    const dir = path.join(__dirname, "..", "uploads", "gallery", project);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (JPG, JPEG, PNG)"));
    }
  },
}).array("images", 10);

// Upload controller
exports.uploadImages = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const project = req.body.project;
    const description = req.body.description || "";
    const descPath = path.join(__dirname, "..", "uploads", "gallery", project, "description.txt");

    const files = req.files.map((file) => ({
      filename: file.filename,
      filePath: file.path, // renamed to avoid conflict with path module
      project,
    }));

    try {
      // Save description.txt
      fs.writeFileSync(descPath, description.trim());

      // Save metadata to DB
      for (const file of files) {
        await saveImageMeta(file);
      }

      return res.status(200).json({
        message: "Images uploaded and saved successfully",
        files,
      });
    } catch (dbErr) {
      return res.status(500).json({
        message: "Upload succeeded but DB or description write failed",
        error: dbErr.message,
      });
    }
  });
};
