const PurchaserController = require("../Controller/PurchaserController");
const { Router } = require("express");
const router = Router();

// Routes for Purchaser
router.post('/addPurchaser', PurchaserController.addPurchaser);
router.put('/editPurchaser/:id', PurchaserController.editPurchaser);
// router.delete('/deletePurchaser/:id', PurchaserController.deletePurchaser);
// router.get('/getSinglePurchaser/:id', PurchaserController.getSinglePurchaser);
router.get('/getAllPurchasers', PurchaserController.getAllPurchasers);
router.get('/purchaserSearch', PurchaserController.getAllPurchasers); // Alias for search


router.post('/recordTransaction', PurchaserController.recordTransaction);

// Route to get transactions by purchaser ID
router.get('/:purchaserId/transactions', PurchaserController.getTransactionsByPurchaserId);

module.exports = router;
