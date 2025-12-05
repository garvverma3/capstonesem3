const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    drugId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive(),
  }),
});

const updateStatusSchema = z.object({
  params: z.object({
    orderId: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(['pending', 'fulfilled', 'cancelled']),
  }),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
};

