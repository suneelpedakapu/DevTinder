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
    res.status(401).send("Error addding user")
  }
});

// API to find particular user using emailId
app.get("/users",async (req,res)=>{
  const user=await User.findOne({emailId:req.body.emailId});
  try{
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
app.patch("/userUpdate",async(req,res)=>{
  const userId=req.body._id;
  const data=req.body;
  try{
    await User.findByIdAndUpdate(userId,data)
    // await User.findOneAndUpdate({emailId:userId},data);
    res.send("user updated successfully");
  }
  catch(err){
    res.status(401).send("Error in updating User")
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