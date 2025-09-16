const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");

const {userAuth}=require("../middlewares/auth");
const {validateProfileEdit, validateSignUp}=require("../utils/validation");

router.get("/profile",userAuth,async (req,res)=>{
  try{
    const user=req.user;
  if(!user){
    throw new Error("User not found")
  }
  res.send(user);
    }
  catch(err){
    res.send("Error in getting profile")
    }
})

router.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        if(!validateProfileEdit(req)){
            throw new Error("Invalid Edit Request")
        }
        const loginUser=req.user;
        Object.keys(req.body).forEach((key)=>(loginUser[key]=req.body[key]));
        await loginUser.save();

        res.json({
            Message:`${loginUser.firstName}, your profile updated successfully`,
            Data:loginUser
        });
    }
    catch(err){
    res.status(401).send("Error:"+err.message);
    }
})

router.patch('/changePassword',userAuth,async(req,res)=>{
    try{
        const loginUser=req.user;
        Object.keys(req.body).forEach((key)=>(loginUser[key]=req.body[key]));
        const passwordHash=await bcrypt.hash(loginUser.password,10);
        loginUser.password=passwordHash;
        await loginUser.save();

        res.json({
            Message:`${loginUser.firstName}, your password updated successfully`,
            Data:loginUser
        });
    }
    catch(err){
    res.status(401).send("Error:"+err.message);
    }
})


module.exports=router;