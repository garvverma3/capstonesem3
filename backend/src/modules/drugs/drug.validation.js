const { z } = require('zod');

const createDrugSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().min(2),
    price: z.coerce.number().positive(),
    quantity: z.coerce.number().int().nonnegative(),
    expiryDate: z.coerce.date(),
    supplier: z.string().min(1),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});

const updateDrugSchema = z.object({
  params: z.object({
    drugId: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().min(2).optional(),
      category: z.string().min(2).optional(),
      price: z.coerce.number().positive().optional(),
      quantity: z.coerce.number().int().nonnegative().optional(),
      expiryDate: z.coerce.date().optional(),
      supplier: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.string().optional(),
    })
    .refine((val) => Object.keys(val).length > 0, {
      message: 'At least one field must be provided',
    }),
});

module.exports = {
  createDrugSchema,
  updateDrugSchema,
};

