const express=require('express');
const app=express();

const dbConnect=require("./config/database");
const User=require("./models/user");

app.use(express.json()); //Middleware to convert json to js obj

// posting user taking details from body of postman
// app.post("/signUp",async (req,res)=>{
//   const user=new User(req.body);
//   try{
//     await user.save();
//     res.send("User saved succcessfully")
//   }
//   catch(err){
//     res.status(401).send("Error addding user")
//   }
// });


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
    const users=await User.find({});
    res.send(users)
  }
  catch(err){
    res.status(401).send("Error in finding users")
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