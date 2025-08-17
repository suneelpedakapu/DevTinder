const express=require('express');
const app=express();


app.use("/user",
  (req,res,next)=>{
    console.log("Route Handler 1")
    // res.send("Route Handler 1 ");
    next();
  },
  (req,res,next)=>{
    console.log("Route Handler 2")
    // res.send("Route Handler 2 ");
    next()
  },
  (req,res,next)=>{
    console.log("Route Handler 3")
    res.send("Route Handler 3 ");
    next()
  },
  (req,res,next)=>{
    console.log("Route Handler 4")
    res.send("Route Handler 4 ");
   }
);



app.listen(3000,()=>{
    console.log("My server successfully running on port 3000...");
});