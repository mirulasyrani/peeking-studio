// validators/uploadSchema.js
const { z } = require("zod");

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  folder: z.string().min(1, "Folder name is required"),
  caption: z.string().optional(),
});

module.exports = {
  uploadSchema,
};
