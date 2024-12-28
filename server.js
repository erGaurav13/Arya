const express =require('express');
const DB=require("./DB/db")
const cors =require('cors')
const ProductRoutes =require("./Routes/ProductRoutes");
const UserRoutes =require("./Routes/UserRoute");
const CartRoutes =require("./Routes/CartRoutes");

const app=express()
app.use(express.json());
app.use(cors())
// Route table;
app.use("/product",ProductRoutes)
app.use("/user",UserRoutes)
app.use("/cart",CartRoutes)

app.get("/",(req,res)=>{

    return res.send("HI ")
})

app.listen(8080,async()=>{
    await DB()
    console.log("Server started")
})