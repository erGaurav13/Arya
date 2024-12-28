const Cart = require("../Schema/CartModel");
const Product = require("../Schema/ProductModel");
const User = require("../Schema/UserModel");

class CartController {
  // Add a product to the cart
  async addToCart(req, res) {
    const { userId, productId, quantity } = req.body;
  
    try {
      // Validate user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Validate product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      // Validate quantity
      if (quantity > product.qty) {
        return res.status(400).send({ message: "Insufficient product quantity" });
      }
  
      // Add a new cart entry
      const cartItem = new Cart({
        userId,
        productId,
        productPrice: product.price,
        quantity,
        totalPrice: product.price * quantity,
        status: "active",
      });
  
      await cartItem.save();
  
      // Update product quantity
      product.qty -= quantity;
      await product.save();
  
      return res.status(201).send({
        message: "Product added to cart",
        cart: cartItem,
      });
    } catch (err) {
      return res.status(500).send({ message: "Server error", error: err.message });
    }
  }
  

  // Get all cart items for a user
  async getCartItems(req, res) {
    const { page = 1, limit = 10, search = "" } = req.query;
  
    try {
      // Fetch cart items with pagination
      const searchConditions = {
        status: "active",
      };
  
      if (search) {
        searchConditions.$or = [
          { userId: { $regex: search, $options: "i" } }, // Search by userId
          { "productId.name": { $regex: search, $options: "i" } }, // Search by product name (after populate)
          { userMobile: { $regex: search, $options: "i" } }, // Search by mobile (if exists in schema)
        ];
      }
  
      const cartItems = await Cart.find(searchConditions)
        .populate("productId", "name price qty") // Populate product details
        .populate("userId", "name mobileNo") // Populate user details
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalItems = await Cart.countDocuments(searchConditions);
  
      return res.status(200).send({
        message: "Cart items retrieved successfully",
        cart: cartItems,
        pagination: {
          totalItems,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
        },
      });
    } catch (err) {
      return res.status(500).send({ message: "Server error", error: err.message });
    }
  }
  
   // Edit a cart item to add a note or update bill status
async editCartItem(req, res) {
  const { cartId } = req.params;
  const { note, billStatus } = req.body;

  try {
    // Find the cart item by ID
    const cartItem = await Cart.findById(cartId);
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    // Update the note and/or bill status if provided
    if (note !== undefined) {
      cartItem.note = note;
    }
    if (billStatus !== undefined) {
      if (!["paid", "unpaid", "partially paid"].includes(billStatus)) {
        return res.status(400).send({ message: "Invalid bill status" });
      }
      cartItem.billStatus = billStatus;
    }

    // Save the updated cart item
    await cartItem.save();

    return res.status(200).send({
      message: "Cart item updated successfully",
      cart: cartItem,
    });
  } catch (err) {
    return res.status(500).send({ message: "Server error", error: err.message });
  }
}



  
}

module.exports = new CartController();
