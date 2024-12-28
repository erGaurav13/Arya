const CartController =require("../Controller/CartController")
const {Router} =require("express");
const router=Router()
router.post('/addToCart',CartController.addToCart)
router.get('/getCart',CartController.getCartItems)

router.put("/cart/:cartId", CartController.editCartItem);
module.exports=router