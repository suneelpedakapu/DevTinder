const express=require('express');
const app=express();

const bcrypt=require("bcrypt");
const dbConnect=require("./config/database");
const User=require("./models/user");
const {validateSignUp}=require("./utils/validation");

app.use(express.json()); //Middleware to convert json to js obj

// API to post user taking details from body of postman
app.post("/signUp",async (req,res)=>{
  try{
  //validate data
  validateSignUp(req);

  //enctpring password
  const {firstName,lastName,emailId,password,age}=req.body;
  const passwordHash=await bcrypt.hash(password,10)
  console.log(passwordHash);

  //creating new instance of user
  const user1=new User({
    firstName,lastName,emailId,password:passwordHash,age
  });

  //Saving new user
  await user1.save();
  res.send("User saved succcessfully")
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
});

app.post("/login",async (req,res)=>{
  try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid Credentials")
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(isPasswordValid){
      res.send("Login Successful")
    }
    else{
      throw new Error ("Invalid Credentials")
    }
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
})

// API to find particular user using emailId
app.get("/users",async (req,res)=>{
  
  try{
    const user=await User.findOne({emailId:req.body.emailId});
    res.send(user);
  }
  catch(error){
    res.status(401).send("Error finding user")
  }
})

// API call to get all users in User Model database
app.get("/feed",async(req,res)=>{
  try{
    const users=await User.findById('68a4ac4cbfdebf3c9ddbe721');
    res.send(users)
  }
  catch(err){
    res.status(401).send("Error in finding users")
  }
});

//API to delete user by Id
app.delete("/userDelete",async (req,res)=>{
  const userId=req.body.userId;
  try{
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  }
  catch(err){
    res.status(401).send("Error in deleting User")
  }
})

// API to update user details with Email
app.patch("/userUpdate/:userId",async(req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;

  try{
    const updateAllow=["age","gender","about","skills"];
    const isUpdateAllow=Object.keys(data).every((k)=>
    updateAllow.includes(k)
    );
    if(!isUpdateAllow){
      throw new Error("check the keys")
    }

    await User.findByIdAndUpdate(userId,data,{runValidators:true})
    res.send("User Updated successfully");
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
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