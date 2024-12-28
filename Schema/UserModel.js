const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    mobileNo: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ }, // Ensures a 10-digit mobile number
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ }, // Basic email format validation
    address: { type: String, required: true, minlength: 5 },
    shopName: { type: String, required: true, minlength: 3 }, // Added shop name field
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

// Middleware to adjust timestamps to IST
userSchema.pre("save", function (next) {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  if (this.isNew || this.isModified("createdAt") || this.isModified("updatedAt")) {
    const now = new Date();
    this.createdAt = new Date(now.getTime() + istOffset); // Adjust 'createdAt'
    this.updatedAt = new Date(now.getTime() + istOffset); // Adjust 'updatedAt'
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
