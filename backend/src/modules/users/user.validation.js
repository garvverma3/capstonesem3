const { z } = require('zod');

const changeRoleSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    role: z.string().min(1, 'Role is required'),
  }),
});

module.exports = { changeRoleSchema };


