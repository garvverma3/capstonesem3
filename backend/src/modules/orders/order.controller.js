const { StatusCodes } = require('http-status-codes');
const prisma = require('../../config/prisma');
const orderService = require('./order.service');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');
const { ROLES } = require('../../constants/roles');

const createOrder = asyncHandler(async (req, res) => {
  const { drugId, quantity } = req.body;
  const userId = req.user.id;

  // Check drug availability
  const drug = await prisma.drug.findUnique({ where: { id: parseInt(drugId) } });
  if (!drug) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }
  if (drug.quantity < quantity) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient stock');
  }

  // Calculate total
  const totalAmount = drug.price * quantity;

  // Create order with order items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Update drug quantity
    await tx.drug.update({
      where: { id: parseInt(drugId) },
      data: { quantity: { decrement: quantity } }
    });

    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: 'pending',
        totalAmount,
        items: {
          create: {
            drugId: parseInt(drugId),
            quantity,
            price: drug.price
          }
        }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            drug: true
          }
        }
      }
    });

    return newOrder;
  });

  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, order, 'Order created'));
});

const listOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const pagination = buildPagination(req.query);

  const filters = {};

  // Pharmacists can only see their own orders (if they are the customer)
  // Admins can see all orders
  if (req.user.role === ROLES.PHARMACIST) {
    filters.userId = req.user.id;
  }

  if (status) filters.status = status;

  const { orders, total } = await orderService.listOrders(filters, {
    skip: pagination.skip,
    limit: pagination.limit
  });

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
  const order = await orderService.findOrderById(req.params.orderId);

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  // Check permissions
  if (
    req.user.role === ROLES.PHARMACIST &&
    order.userId !== req.user.id
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

  const order = await orderService.findOrderById(orderId);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  // Check permissions
  if (
    req.user.role === ROLES.PHARMACIST &&
    order.userId !== req.user.id
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Not allowed');
  }

  const updatedOrder = await orderService.updateOrderStatus(parseInt(orderId), status);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, updatedOrder, 'Order updated'));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.findOrderById(orderId);
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'fulfilled') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete fulfilled orders',
    );
  }

  await orderService.deleteOrder(parseInt(orderId));

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
