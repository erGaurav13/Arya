const UserController =require("../Controller/UserController")
const {Router} =require("express");
const router=Router()
router.post('/addUser',UserController.addUser)
router.put('/editUser/:id',UserController.editUser)
router.delete('/delete/:id',UserController.deleteUser)
router.get('/getSingleUser/:id',UserController.getSingleUser);
router.get('/getAllUser',UserController.getAllUsers);
router.get('/userSearch',UserController.getAllUsers);


module.exports=router