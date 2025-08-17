const express=require('express');
const app=express();

const {adminAuth,user}=require("./middlewares/auth")

app.use("/admin",adminAuth);

app.use("/user",user);

app.get("/user/getAlldata",(req,res)=>{
  res.send("All data sent")
})

app.listen(3000,()=>{
    console.log("My server successfully running on port 3000...");
});