const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: function () {
        return this.productPrice * this.quantity;
      },
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "ordered", "canceled"],
      default: "active",
    },
    note: {
      type: String, // Field to store notes
      default: "",
    },
    billStatus: {
      type: String,
      enum: ["paid", "unpaid", "partially paid"], // Status of the bill
      default: "unpaid",
    },
  },
  { timestamps: true }
);

// Middleware to ensure IST time adjustment
cartSchema.pre("save", function (next) {
  const istOffset = 5.5 * 60 * 60 * 1000;
  if (this.isNew || this.isModified("createdAt") || this.isModified("updatedAt")) {
    const now = new Date();
    this.createdAt = new Date(now.getTime() + istOffset);
    this.updatedAt = new Date(now.getTime() + istOffset);
  }
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
