
const mongoose=require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3 ,unique:true},
        qty: { type: Number, required: true },
        status: { type: Number, required: true, enum: [0, 1] },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

productSchema.pre("save", function (next) {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    if (this.isNew || this.isModified("createdAt") || this.isModified("updatedAt")) {
      const now = new Date();
      this.createdAt = new Date(now.getTime() + istOffset); // Adjust 'createdAt'
      this.updatedAt = new Date(now.getTime() + istOffset); // Adjust 'updatedAt'
    }
    next();
  });

const Product=mongoose.model('Product',productSchema)
module.exports= Product