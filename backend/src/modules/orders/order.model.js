const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    drug: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drug',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    customerName: { type: String, required: true, trim: true },
    orderDate: { type: Date, default: Date.now },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };


