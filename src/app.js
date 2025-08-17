const express=require('express');
const app=express();

const {adminAuth}=require("./middlewares/auth")

app.use("/admin",adminAuth);

app.get("/admin/getAlldata", (req,res,next)=>{
  res.send("All data sent");
});


app.get("/admin/deleteUser",(req,res)=>{
  res.send("Delete User")
});


app.listen(3000,()=>{
    console.log("My server successfully running on port 3000...");
});