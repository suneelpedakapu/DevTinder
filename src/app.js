const express=require('express');
const app=express();

const dbConnect=require("./config/database");
const User=require("./models/user");

app.use(express.json()); //Middleware to convert json to js obj

// API to post user taking details from body of postman
app.post("/signUp",async (req,res)=>{
  const user=new User(req.body);
  try{
    await user.save();
    res.send("User saved succcessfully")
  }
  catch(err){
    res.status(401).send("Error:"+err.message)
  }
});

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
    throw new Error("Check the Keys");
    }
    // if(data?.skills.length>5){throw new Error("Skills shouldn't exceed 5")}
  // await User.updateOne({emailId:userId},data)
  await User.findByIdAndUpdate(userId,data,{runValidators:true});
  res.send("user updated successfully");
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