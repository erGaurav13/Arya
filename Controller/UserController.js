const User =require('../Schema/UserModel')

class UserController {
    // Add User
    async addUser(req, res) {
      const { name, mobileNo, email, address, shopName } = req.body;
  
      // Validation for required fields
      if (!name || !mobileNo || !email || !address || !shopName) {
        return res.status(400).send({ message: "All fields are required" });
      }
  
      try {
        // Create a new user
        const newUser = await User.create({ name, mobileNo, email, address, shopName });
        return res.status(201).send({ message: "User created successfully", data: newUser });
      } catch (err) {
        // Handle duplicate key errors (e.g., unique constraints on mobileNo or email)
        if (err.code === 11000) {
          return res.status(409).send({ message: "Duplicate entry: " + JSON.stringify(err.keyValue) });
        }
        return res.status(500).send({ message: "Error creating user", error: err.message });
      }
    }
  
    // Edit User
    async editUser(req, res) {
      const { id } = req.params; // User ID from URL
      const { name, mobileNo, email, address, shopName } = req.body;
  
      try {
        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { name, mobileNo, email, address, shopName },
          { new: true, runValidators: true } // Return the updated document and validate the inputs
        );
  
        if (!updatedUser) {
          return res.status(404).send({ message: "User not found" });
        }
  
        return res.status(200).send({ message: "User updated successfully", data: updatedUser });
      } catch (err) {
        return res.status(500).send({ message: "Error updating user", error: err.message });
      }
    }
  
    // Delete User
    async deleteUser(req, res) {
      const { id } = req.params; // User ID from URL
  
      try {
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(id);
  
        if (!deletedUser) {
          return res.status(404).send({ message: "User not found" });
        }
  
        return res.status(200).send({ message: "User deleted successfully", data: deletedUser });
      } catch (err) {
        return res.status(500).send({ message: "Error deleting user", error: err.message });
      }
    }

     // Get All Users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      return res.status(200).send({ message: "Users fetched successfully", data: users });
    } catch (err) {
      return res.status(500).send({ message: "Error fetching users", error: err.message });
    }
  }

// Search Users
async searchUsers(req, res) {
  const { query } = req.query; // Search query from frontend

  if (!query) {
    return res.status(400).send({ message: "Query parameter is required" });
  }

  try {
    // Find users by name or mobile number (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobileNo: { $regex: query, $options: "i" } },
      ],
    });

    if (users.length === 0) {
      return res.status(404).send({ message: "No users found" });
    }

    return res.status(200).send({ message: "Users fetched successfully", data: users });
  } catch (err) {
    return res.status(500).send({ message: "Error searching users", error: err.message });
  }
}


  // Get Single User
  async getSingleUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send({ message: "User fetched successfully", data: user });
    } catch (err) {
      return res.status(500).send({ message: "Error fetching user", error: err.message });
    }
  }
  }
  
  module.exports = new UserController();