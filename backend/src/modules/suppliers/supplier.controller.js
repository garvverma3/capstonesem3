const { StatusCodes } = require('http-status-codes');
const { ApiResponse } = require('../../utils/apiResponse');
const { ApiError } = require('../../utils/apiError');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');
const supplierService = require('./supplier.service');
const prisma = require('../../config/prisma');

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, supplier, 'Supplier created'));
});

const listSuppliers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const pagination = buildPagination(req.query);
  const filter = {};
  if (search) {
    filter.name = search;
  }

  const { suppliers, total } = await supplierService.listSuppliers({
    filter,
    skip: pagination.skip,
    limit: pagination.limit,
  });

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
  const supplier = await supplierService.getSupplierById(req.params.supplierId);
  if (!supplier) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Supplier not found');
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, supplier, 'Supplier fetched'));
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.updateSupplier(req.params.supplierId, req.body);
  if (!supplier) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Supplier not found');
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, supplier, 'Supplier updated'));
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;

  // Check if supplier has associated drugs
  const drugsCount = await prisma.drug.count({
    where: { supplierId: parseInt(supplierId) }
  });

  if (drugsCount > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete supplier. ${drugsCount} drug(s) are associated with this supplier. Please reassign or delete the drugs first.`
    );
  }

  await supplierService.deleteSupplier(supplierId);

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

