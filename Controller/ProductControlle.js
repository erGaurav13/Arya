const ProductDB = require("../Schema/ProductModel");

// Utility functions
const errResponse = (res, err) => {
    return res.status(500).send({ error: err.message });
};

const sendData = (res, data, msg) => {
    return res.status(200).send({ data, msg });
};

class Product {
    // Create Product
    async createProduct(req, res) {
        const { name, qty, price, status = 1 } = req.body;

        // Validation for required fields
        if (!name) return res.status(400).send("Name is required");
        if (!price) return res.status(400).send("Price is required");
        if (!qty) return res.status(400).send("Quantity is required");

        try {
            // Create product in the database
            const createProduct = await ProductDB.create({
                name,
                qty,
                price,
                status,
            });

            // Send response with created product
            return sendData(res, createProduct, "Product created successfully");
        } catch (err) {
            // Handle errors
            return errResponse(res, err);
        }
    }

    // Get All Products
// Updated: Get All Products with Pagination and Search
async getAllProducts(req, res) {
    const { page = 1, limit = 10, search = "" } = req.query; // Default values for page and limit

    try {
        const query = search
            ? { name: { $regex: search, $options: "i" } } // Case-insensitive search by name
            : {};

        const products = await ProductDB.find(query)
            .skip((page - 1) * limit) // Skip records for pagination
            .limit(parseInt(limit)); // Limit the number of records returned

        const total = await ProductDB.countDocuments(query); // Get total count for pagination

        return res.status(200).send({
            data: products,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
}



    // Get Single Product by ID
    async getProductById(req, res) {
        const { id } = req.body;

        try {
            const product = await ProductDB.findById(id);

            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }

            return sendData(res, product, "Product retrieved successfully");
        } catch (err) {
            return errResponse(res, err);
        }
    }

    // Update Product
    async updateProduct(req, res) {
        const { id } = req.params;
        const { name, qty, price, status } = req.body;

        try {
            const updatedProduct = await ProductDB.findByIdAndUpdate(
                id,
                { name, qty, price, status },
                { new: true } // Return the updated document
            );

            if (!updatedProduct) {
                return res.status(404).send({ message: "Product not found" });
            }

            return sendData(res, updatedProduct, "Product updated successfully");
        } catch (err) {
            return errResponse(res, err);
        }
    }

    // Delete Product
    async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            const deletedProduct = await ProductDB.findByIdAndDelete(id);

            if (!deletedProduct) {
                return res.status(404).send({ message: "Product not found" });
            }

            return sendData(res, deletedProduct, "Product deleted successfully");
        } catch (err) {
            return errResponse(res, err);
        }
    }
}

module.exports = new Product();
