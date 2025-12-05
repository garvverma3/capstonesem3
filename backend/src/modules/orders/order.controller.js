const { StatusCodes } = require('http-status-codes');
const { Order } = require('./order.model');
const { Drug } = require('../drugs/drug.model');
const { determineStatus } = require('../drugs/drug.helpers');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');
const { ROLES } = require('../../constants/roles');

const createOrder = asyncHandler(async (req, res) => {
  const { drug: drugId, quantity } = req.body;

  const drug = await Drug.findById(drugId);
  if (!drug) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }
  if (drug.quantity < quantity) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock');
  }

  drug.quantity -= quantity;
  drug.status = determineStatus({
    quantity: drug.quantity,
    expiryDate: drug.expiryDate,
  });
  await drug.save();

  const order = await Order.create({
    ...req.body,
    pharmacist: req.user._id,
  });

  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, order, 'Order created'));
});

const listOrders = asyncHandler(async (req, res) => {
  const {
    status,
    customerName,
    pharmacistId,
    dateFrom,
    dateTo,
  } = req.query;
  const pagination = buildPagination(req.query);
  const filter = {};

  if (req.user.role === ROLES.PHARMACIST) {
    filter.pharmacist = req.user._id;
  } else if (pharmacistId) {
    filter.pharmacist = pharmacistId;
  }
  if (status) filter.status = status;
  if (customerName) {
    filter.customerName = { $regex: customerName, $options: 'i' };
  }
  if (dateFrom || dateTo) {
    filter.orderDate = {};
    if (dateFrom) filter.orderDate.$gte = new Date(dateFrom);
    if (dateTo) filter.orderDate.$lte = new Date(dateTo);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('drug')
      .populate('pharmacist', 'name email')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      orders,
      'Orders fetched',
      {
        total,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    ),
  );
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('drug')
    .populate('pharmacist', 'name email role');
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (
    req.user.role === ROLES.PHARMACIST &&
    order.pharmacist._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Not allowed');
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, order, 'Order fetched'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (
    req.user.role === ROLES.PHARMACIST &&
    order.pharmacist.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Not allowed');
  }

  order.status = status;
  await order.save();

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, order, 'Order updated'));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'fulfilled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete fulfilled orders',
    );
  }

  await Order.deleteOne({ _id: orderId });
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Order deleted'));
});

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
};

