const { User } = require('./user.model');

const createUser = (data) => User.create(data);

const findUserByEmail = (email, options = {}) =>
  User.findOne({ email }).select(options.select || '');

const findUserById = (id) => User.findById(id);

const updateUserRole = (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true });

const listUsers = ({ filter = {}, skip = 0, limit = 10 }) =>
  User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

const countUsers = (filter = {}) => User.countDocuments(filter);

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserRole,
  listUsers,
  countUsers,
};


