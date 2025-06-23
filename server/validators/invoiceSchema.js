// server/validations/invoice.js
const { z } = require('zod');

const invoiceSchema = z.object({
  clientName: z.string().min(1),
  email: z.string().email(),
  sessionType: z.string().min(1),
  date: z.string().min(1),
  amount: z.string().min(1),
  notes: z.string().optional(),
});

module.exports = { invoiceSchema };
