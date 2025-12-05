const { z } = require('zod');

const supplierSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

const createSupplierSchema = z.object({
  body: supplierSchema,
});

const updateSupplierSchema = z.object({
  params: z.object({
    supplierId: z.string().min(1),
  }),
  body: supplierSchema.partial().refine((val) => Object.keys(val).length > 0, {
    message: 'At least one field is required',
  }),
});

module.exports = {
  createSupplierSchema,
  updateSupplierSchema,
};


