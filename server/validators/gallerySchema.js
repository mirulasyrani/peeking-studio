const { z } = require("zod");

const projectParamSchema = z.object({
  project: z.string().min(1, "Project name is required"),
});

module.exports = { projectParamSchema };
