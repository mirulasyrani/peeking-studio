const db = require("../db");

exports.saveImageMeta = async (image) => {
  const { project, filename, path } = image;
  await db.query(
    "INSERT INTO gallery_images (project, filename, path) VALUES ($1, $2, $3)",
    [project, filename, path]
  );
};
