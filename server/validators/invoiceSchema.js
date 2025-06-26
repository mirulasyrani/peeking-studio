const { z } = require("zod");

const invoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  email: z.string().email("Invalid email format"),
  sessionType: z.string().min(1, "Session type is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }),
  notes: z.string().optional(),
});

const invoiceIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invoice ID must be a number"),
});

module.exports = {
  invoiceSchema,
  invoiceIdParamSchema,
};
