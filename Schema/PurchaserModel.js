const mongoose = require('mongoose');

const purchaserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true, // Ensures the mobile number is unique
    match: /^[0-9]{10}$/, // Ensures it's a 10-digit number
  },
  active: {
    type: Boolean,
    default: true, // Default to active
  },
  totalPurchasing: {
    type: Number,
    default: 0, // Default value
    min: 0, // Cannot be negative
  },
  totalPaid: {
    type: Number,
    default: 0, // Default value
    min: 0, // Cannot be negative
  },
  currentRemaining: {
    type: Number,
    default: 0, // Default value
    validate: {
      validator: function (value) {
        return value >= 0; // Ensures the value is non-negative
      },
      message: "Current remaining balance cannot be negative.",
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Purchaser = mongoose.model('Purchaser', purchaserSchema);

module.exports = Purchaser;
