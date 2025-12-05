const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock', 'expired'],
      default: 'in-stock',
    },
  },
  { timestamps: true },
);

const Drug = mongoose.model('Drug', drugSchema);

module.exports = { Drug };


