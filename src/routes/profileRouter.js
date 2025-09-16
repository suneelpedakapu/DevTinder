const express=require("express");
const router=express.Router();

const{userAuth}=require("../middlewares/auth")

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


module.exports=router;