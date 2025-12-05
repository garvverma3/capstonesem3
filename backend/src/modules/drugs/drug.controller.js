const { StatusCodes } = require('http-status-codes');
const { Drug } = require('./drug.model');
const { Supplier } = require('../suppliers/supplier.model');
const { ApiError } = require('../../utils/apiError');
const { ApiResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { buildPagination } = require('../../utils/paginate');
const { determineStatus } = require('./drug.helpers');

const createDrug = asyncHandler(async (req, res) => {
  const supplierExists = await Supplier.exists({ _id: req.body.supplier });
  if (!supplierExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Supplier not found');
  }
  const payload = {
    ...req.body,
    status: determineStatus(req.body),
  };
  const drug = await Drug.create(payload);
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

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) filter.category = category;
  if (supplier) filter.supplier = supplier;
  if (status) filter.status = status;
  if (minQuantity || maxQuantity) {
    filter.quantity = {};
    if (minQuantity) filter.quantity.$gte = Number(minQuantity);
    if (maxQuantity) filter.quantity.$lte = Number(maxQuantity);
  }
  if (expiryBefore) {
    filter.expiryDate = { $lte: new Date(expiryBefore) };
  }

  const [drugs, total] = await Promise.all([
    Drug.find(filter)
      .populate('supplier')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 }),
    Drug.countDocuments(filter),
  ]);

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
  const drug = await Drug.findById(drugId).populate('supplier');
  if (!drug) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, drug, 'Drug fetched'));
});

const updateDrug = asyncHandler(async (req, res) => {
  const { drugId } = req.params;
  const existing = await Drug.findById(drugId);
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }

  if (req.body.supplier) {
    const supplierExists = await Supplier.exists({ _id: req.body.supplier });
    if (!supplierExists) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Supplier not found');
    }
  }

  const payload = { ...req.body };
  const quantity = payload.quantity ?? existing.quantity;
  const expiryDate = payload.expiryDate ?? existing.expiryDate;
  payload.status = determineStatus({ quantity, expiryDate });

  const updated = await Drug.findByIdAndUpdate(drugId, payload, {
    new: true,
  }).populate('supplier');

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, updated, 'Drug updated'));
});

const deleteDrug = asyncHandler(async (req, res) => {
  const { drugId } = req.params;
  const drug = await Drug.findByIdAndDelete(drugId);
  if (!drug) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Drug not found');
  }
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

