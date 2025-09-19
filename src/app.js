const express=require('express');
const app=express();

const cookieParser=require("cookie-parser");
const dbConnect=require("./config/database");

app.use(express.json()); //Middleware to convert json to js obj for signUp process
app.use(cookieParser()); // Middleware to read the cookies or tokens in console

const authRouter=require('./routes/authRouter');
const profileRouter=require('./routes/profileRouter');
const connectionRouter=require('./routes/connectionRouter');
const userRouter=require("./routes/userRouter");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connectionRouter);
app.use("/",userRouter);


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