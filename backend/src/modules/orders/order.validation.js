const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    drug: z.string().min(1),
    quantity: z.coerce.number().int().positive(),
    customerName: z.string().min(2),
    orderDate: z.coerce.date().optional(),
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

