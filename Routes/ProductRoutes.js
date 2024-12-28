const ProductController =require("../Controller/ProductControlle")
const {Router} =require("express");
const router=Router()
router.post('/addProduct',ProductController.createProduct)
router.put('/editProduct/:id',ProductController.updateProduct)
router.delete('/delete',ProductController.deleteProduct)
router.post('/getSingleProduct',ProductController.getProductById);
router.get('/getAllProduct',ProductController.getAllProducts);


module.exports=router