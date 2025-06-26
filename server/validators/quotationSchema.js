const { z } = require("zod");

// Used when creating a quotation
const createQuotationSchema = z.object({
  quotation_no: z.string().min(1, "Quotation number is required"),
  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email"),
  client_address: z.string().min(1, "Client address is required"),
  project_title: z.string().min(1, "Project title is required"),
  project_date: z.string().min(1, "Project date is required"), // or use regex if you want date format checking
  notes: z.string().optional(),

  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Quantity must be a positive number",
        }),
        unit_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
          message: "Unit price must be a number",
        }),
        total: z.string().optional(), // Optional because frontend computes it
      })
    )
    .nonempty("At least one item is required"),

  total_amount: z.number().min(0),
  amount_in_words: z.string().min(1),
});

// Used for validating `:id` param in route
const quotationIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Quotation ID must be numeric"),
});

// Used when sending email with optional custom content
const emailSchema = z.object({
  to: z.string().email("Invalid recipient email"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

module.exports = {
  createQuotationSchema,
  emailSchema,
  quotationIdParamSchema,
};
