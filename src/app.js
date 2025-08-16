const express=require('express');
const app=express();



app.get("/users",(req,res)=>{
    res.send({firstname:"Suneel",lastname:"Pedakapu"})
})



app.post("/user",(req,res)=>{
    res.send("User added successfully to DB")
})

app.delete("/user",(req,res)=>{
    res.send("User Deleted successfully from DB")
})


app.use("/",(req,res)=>{
    res.send("Hello test ");
});



app.listen(3000,()=>{
    console.log("My server successfully running on port 3000...");
});