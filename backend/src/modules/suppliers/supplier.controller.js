const { StatusCodes } = require('http-status-codes');
const { Supplier } = require('./supplier.model');
const { ApiResponse } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/apiError');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, supplier, 'Supplier created'));
});

const listSuppliers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const pagination = buildPagination(req.query);
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    Supplier.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 }),
    Supplier.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      suppliers,
      'Suppliers fetched',
      {
        total,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    ),
  );
});

const getSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.supplierId);
  if (!supplier) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Supplier not found');
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, supplier, 'Supplier fetched'));
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(
    req.params.supplierId,
    req.body,
    { new: true },
  );
  if (!supplier) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Supplier not found');
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, supplier, 'Supplier updated'));
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.supplierId);
  if (!supplier) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Supplier not found');
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Supplier deleted'));
});

module.exports = {
  createSupplier,
  listSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};


