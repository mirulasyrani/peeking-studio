const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Use folder name from req.body
      const folderName = req.body.folder;
      if (!folderName) {
        return cb(new Error("Folder name is required"));
      }
      const folderPath = path.join(__dirname, "..", "uploads", folderName);
      // Create folder recursively if it doesn't exist
      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    // prepend timestamp to original filename to avoid conflicts
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/upload/upload
router.post("/upload", upload.array("images", 10), (req, res) => {
  try {
    const { title, folder, caption } = req.body;

    if (!title || !folder) {
      return res.status(400).json({ error: "Title and folder are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image file is required" });
    }

    const fileInfos = req.files.map(file => ({
      filename: file.filename,
      path: file.path.replace(/\\/g, "/"), // Normalize Windows paths to URL format
    }));

    return res.status(200).json({
      message: "Upload successful",
      title,
      folder,
      caption,
      files: fileInfos,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Server error during upload" });
  }
});

module.exports = router;
