const prisma = require('../../config/prisma');

const createUser = (data) => prisma.user.create({ data });

const findUserByEmail = (email, options = {}) => {
  const select = options.select ? parseSelectString(options.select) : undefined;
  return prisma.user.findUnique({
    where: { email },
    select: select || undefined
  });
};

const findUserById = (id) => prisma.user.findUnique({ where: { id: parseInt(id) } });

const updateUserRole = (id, role) =>
  prisma.user.update({
    where: { id: parseInt(id) },
    data: { role }
  });

const listUsers = ({ filter = {}, skip = 0, limit = 10 }) =>
  prisma.user.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

const countUsers = (filter = {}) => prisma.user.count({ where: filter });

// Helper to parse Mongoose-style select strings like '+password +refreshTokenVersion'
const parseSelectString = (selectStr) => {
  if (!selectStr) return undefined;
  const fields = selectStr.split(' ').filter(Boolean);
  const select = {};
  fields.forEach(field => {
    const key = field.replace('+', '');
    select[key] = true;
  });
  return select;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserRole,
  listUsers,
  countUsers,
};
