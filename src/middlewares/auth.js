const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async (req,res,next)=>{
  try{
  // Read the token from req.cookies
  const {token}=req.cookies;
  if(!token){
    throw new Error("Token Invalid")
  }
  //validate token 
  const decodeMessage=await jwt.verify(token,"Suneel@143")
  //finding user and adding to request
  const {_id}=decodeMessage;
  const user=await User.findById(_id);
  req.user=user;
  next()
}
catch(err){
  res.status(400).send("Error:"+err.message)
}
}

module.exports={
  userAuth
}