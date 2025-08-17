const express=require('express');
const app=express();

const {adminAuth,user}=require("./middlewares/auth")

// error handlimg using error parameter
app.get("/getUserData",(req,res)=>{
  throw new Error("error thrown");
});

app.use("/",(err,req,res,next)=>{
  if(err){
    res.status(500).send("Something went wrong")
  }
})


// error handling using try and catch
app.use("/",(req,res)=>{
  try{
    throw new Error("New error thrown")
  }
  catch(err){
    res.status(500).send("Error occured please review this")
  }
});


app.listen(3000,()=>{
    console.log("My server successfully running on port 3000...");
});