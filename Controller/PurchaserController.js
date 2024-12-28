const Purchaser = require('../Schema/PurchaserModel'); // Adjust the path to your model
const Transaction=require('../Schema/Transaction')
class PurchaserController {
  // Add a new purchaser
  static async addPurchaser(req, res) {
    try {
      const { name, address, mobileNo, active } = req.body;

      // Validate input
      if (!name || !address || !mobileNo) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const newPurchaser = new Purchaser({ name, address, mobileNo, active });
      const savedPurchaser = await newPurchaser.save();

      res.status(201).json({ message: 'Purchaser added successfully.', purchaser: savedPurchaser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Mobile number must be unique.' });
      }
      res.status(500).json({ message: 'Error adding purchaser.', error: error.message });
    }
  }

  // Edit an existing purchaser
  static async editPurchaser(req, res) {
    try {
      const { id } = req.params;
      const { name, address, mobileNo, active } = req.body;

      const updatedPurchaser = await Purchaser.findByIdAndUpdate(
        id,
        { name, address, mobileNo, active },
        { new: true, runValidators: true }
      );

      if (!updatedPurchaser) {
        return res.status(404).json({ message: 'Purchaser not found.' });
      }

      res.status(200).json({ message: 'Purchaser updated successfully.', purchaser: updatedPurchaser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Mobile number must be unique.' });
      }
      res.status(500).json({ message: 'Error updating purchaser.', error: error.message });
    }
  }

  // Get all purchasers with pagination and search
  static async getAllPurchasers(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const query = {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
          { address: { $regex: search, $options: 'i' } }, // Case-insensitive search by address
          { mobileNo: { $regex: search, $options: 'i' } }, // Search by mobile number
        ],
      };

      const skip = (page - 1) * limit;

      const [purchasers, total] = await Promise.all([
        Purchaser.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Purchaser.countDocuments(query),
      ]);

      res.status(200).json({
        message: 'Purchasers retrieved successfully.',
        data: purchasers,
        total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchasers.', error: error.message });
    }
  }

  static async recordTransaction(req, res) {
    try {
      const { purchaserId, paymentMode, amount, remark } = req.body;

      // Find the purchaser
      const purchaser = await Purchaser.findById(purchaserId);
      if (!purchaser) {
        return res.status(404).json({ message: 'Purchaser not found.' });
      }

      // Validate transaction amount
      if (amount <= 0) {
        return res.status(400).json({ message: 'Transaction amount must be positive.' });
      }

      // Ensure currentRemaining doesn't go negative
      if (purchaser.currentRemaining - amount < 0) {
        return res.status(400).json({ message: 'Transaction exceeds current remaining balance.' });
      }

      // Create a new transaction
      const transaction = new Transaction({
        purchaserId,
        paymentMode,
        amount,
        remark,
      });
      await transaction.save();

      // Update purchaser details
      const totalPaidNumber = Number(purchaser.totalPaid);
const amountNumber = Number(amount);

console.log("totalPaid:", totalPaidNumber);
console.log("amount:", amountNumber);

// Check if conversion is successful
if (isNaN(totalPaidNumber) || isNaN(amountNumber)) {
  return res.status(400).json({ message: 'Invalid amount or totalPaid value.' });
}
let sum= totalPaidNumber + amountNumber
console.log(sum,"D")
purchaser.totalPaid = sum;
      purchaser.currentRemaining -= amount;
      await purchaser.save();

      res.status(201).json({
        message: 'Transaction recorded successfully.',
        transaction,
        purchaser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error recording transaction.', error: error.message });
    }
  }

  // Get transactions by purchaser ID
  static async getTransactionsByPurchaserId(req, res) {
    try {
      const { purchaserId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        Transaction.find({ purchaserId }).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Transaction.countDocuments({ purchaserId }),
      ]);

      if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this purchaser.' });
      }

      res.status(200).json({
        message: 'Transactions retrieved successfully.',
        data: transactions,
        total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving transactions.', error: error.message });
    }
  }
}

module.exports = PurchaserController;
