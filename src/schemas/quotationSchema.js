import { z } from 'zod';

export const frontendQuotationSchema = z.object({
  quotation_no: z.string().min(1),
  client_name: z.string().min(1),
  client_email: z.string().email(),
  client_address: z.string().min(1),
  project_title: z.string().min(1),
  project_date: z.string().min(1),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a valid number'),
        unit_price: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a valid number'),
        total: z.string(),
      })
    )
    .min(1, 'At least one item is required'),
  total_amount: z.number().min(0),
  amount_in_words: z.string().min(1),
});
