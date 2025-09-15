const express=require('express');
const app=express();

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");

const dbConnect=require("./config/database");
const User=require("./models/user");
const {validateSignUp}=require("./utils/validation");
const{userAuth}=require("./middlewares/auth")

app.use(express.json()); //Middleware to convert json to js obj for signUp process
app.use(cookieParser());// Middleware to read the cookies in console


// API to post user taking details from body of postman
app.post("/signUp",async (req,res)=>{
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

app.post("/login",async (req,res)=>{
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

app.post("/sendRequest",userAuth,async (req,res)=>{
  const user=req.user;
  if(!user){
    throw new Error("User not found")
  }
  res.send(user.firstName+" sent request")
});


//API to get profile
app.get("/profile",userAuth,async (req,res)=>{
  const user=req.user;
  if(!user){
    throw new Error("User not found")
  }
  res.send(user);
})



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