const mongoose =require('mongoose');

const connectToDb=async()=>{
 try{
 await mongoose.connect("mongodb+srv://r:f@cluster0.h1xl8c4.mongodb.net/arya");
 console.log("Connected to db")
 }catch(err){
    console.log(err)
 }

}


module.exports=connectToDb;