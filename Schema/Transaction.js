const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    purchaserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchaser",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Default to the current date
    },
    paymentMode: {
      type: String,
      required: true,
      enum: ["Cash", "Card", "Online"], // Valid payment modes
    },
    amount: {
      type: Number,
      required: true,
      min: 1, // Must be a positive amount
    },
    remark: {
      type: String,
      trim: true,
    },
  }, {
    timestamps: true,
  });
  
  const Transaction = mongoose.model("Transaction", transactionSchema);
  
  module.exports = Transaction;
  