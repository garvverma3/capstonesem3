const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true },
);

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = { Supplier };


