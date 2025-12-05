const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');
const { determineStatus } = require('./drug.helpers');
const drugService = require('./drug.service');
// We need to check supplier existence, best to use the service if available or prisma direct if acceptable.
// Since we don't have checkSupplier in drugService, let's use prisma direct from config for existence checks or add it to service.
// Simpler to just use prisma here for strict checks or blindly create. 
// Let's import prisma config to check supplier existence easily.
const prisma = require('../../config/prisma');

const createDrug = asyncHandler(async (req, res) => {
  const { supplier: supplierId } = req.body;
  if (supplierId) {
    const supplierExists = await prisma.supplier.findUnique({ where: { id: parseInt(supplierId) } });
    if (!supplierExists) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Supplier not found');
    }
  }

  const payload = {
    ...req.body,
    supplierId: parseInt(supplierId), // Map supplier to supplierId for Prisma
    status: determineStatus(req.body),
  };
  delete payload.supplier; // Remove the old field name

  const drug = await drugService.createDrug(payload);
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, drug, 'Drug created'));
});

const listDrugs = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    supplier,
    status,
    minQuantity,
    maxQuantity,
    expiryBefore,
  } = req.query;
  const pagination = buildPagination(req.query);

  const filter = {};
  if (search) filter.name = search;
  if (category) filter.category = category;
  if (supplier) filter.supplierId = supplier;
  if (status) filter.status = status;
  if (minQuantity) filter.minQuantity = minQuantity;
  if (maxQuantity) filter.maxQuantity = maxQuantity;
  if (expiryBefore) filter.expiryBefore = expiryBefore;

  const { drugs, total } = await drugService.listDrugs({
    filter,
    skip: pagination.skip,
    limit: pagination.limit,
  });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      drugs,
      'Drugs fetched',
      {
        total,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    ),
  );
});

const getDrugById = asyncHandler(async (req, res) => {
  const { drugId } = req.params;
  const drug = await drugService.getDrugById(drugId);
  if (!drug) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, drug, 'Drug fetched'));
});

const updateDrug = asyncHandler(async (req, res) => {
  const { drugId } = req.params;
  const existing = await drugService.getDrugById(drugId);
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }

  if (req.body.supplier) {
    const supplierExists = await prisma.supplier.findUnique({ where: { id: parseInt(req.body.supplier) } });
    if (!supplierExists) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Supplier not found');
    }
  }

  const payload = { ...req.body };
  if (payload.supplier) {
    payload.supplierId = parseInt(payload.supplier);
    delete payload.supplier;
  }

  const quantity = payload.quantity ?? existing.quantity;
  const expiryDate = payload.expiryDate ?? existing.expiryDate;
  payload.status = determineStatus({ quantity, expiryDate });

  const updated = await drugService.updateDrug(drugId, payload);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, updated, 'Drug updated'));
});

const deleteDrug = asyncHandler(async (req, res) => {
  const { drugId } = req.params;
  // Check existence first or handle error? Service could handle, but controller pattern usually checks.
  // Prisma delete throws if not found usually unless using deleteMany.
  // Let's safe check.
  const existing = await drugService.getDrugById(drugId);
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }

  await drugService.deleteDrug(drugId);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Drug deleted'));
});

module.exports = {
  createDrug,
  listDrugs,
  getDrugById,
  updateDrug,
  deleteDrug,
};

