const express=require('express');
const app=express();

const dbConnect=require("./config/database");
const User=require("./models/user");

app.post("/signUp",async (req,res)=>{
  const user = new User({
    firstName:"Balu",
    lastName:"Pedakapu",
    emailId:"balupedakapu143@gmail.com",
    password:"balu@143"
  })
  try{
  await user.save();
  res.send("User Sent Successfully");
  }
  catch(error){
    res.status(401).send("Error saving the User:" + error.message);
  }
});


dbConnect().
then(()=>{
    console.log("Db Connected Successfully");
    app.listen(3000,()=>{
      console.log("My server successfully running on port 3000..."); }
    );
}).
catch(error=>{
    console.log("Error Occured")
});