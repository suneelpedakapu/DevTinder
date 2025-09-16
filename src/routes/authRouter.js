const express=require("express");
const router=express.Router();

const User=require("../models/user");
const {validateSignUp}=require("../utils/validation");
const bcrypt=require("bcrypt");

router.post("/signUp",async (req,res)=>{
  try{
  //validating schema values
  validateSignUp(req);
  //password encrpyting
  const {firstName,lastName,emailId,password}=req.body;
  const passwordHash=await bcrypt.hash(password,10);
  //creating new user
  const user1=new User({
    firstName,lastName,emailId,password:passwordHash
  })
  await user1.save()
  res.send("User saved successfully")
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
});

router.post("/login",async (req,res)=>{
  try{
    const{emailId,password}=req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordValid=await user.validPassword(password);
    if(isPasswordValid){
      //creating token
      const token=await user.getJWT();
      //wrapping it in cookie
      res.cookie("token",token);
      
      res.send("Login successfull")
    }
    else{
      res.send("Invalid credentials")
    }
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
});



module.exports=router;
