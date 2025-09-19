const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} isn't valid one`
        }
    }
},{timestamps:true})


// not mandatory, but checking something before saving
// connectionRequestSchema.pre("save",function(next){
//     const connectionRequest=this;
//     //checking from and to are same
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("You can't send request to yourself")
//     }
//     next();
// })

module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);