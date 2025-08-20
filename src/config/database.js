const mongoose=require("mongoose");
const url="mongodb+srv://suneelpedakapu143:Suneel143@cluster0.cnat093.mongodb.net/devTinder";

const dbConnect=async()=>{
   await mongoose.connect(url);
}

module.exports=dbConnect;