const express=require("express");
const router=express.Router();
const ConnectionRequest=require("../models/connectionRequest");
const {userAuth}=require("../middlewares/auth");
const User=require("../models/user");


router.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        //getting loginUser and status and toUser
        const fromUserId=req.user._id;
        const status=req.params.status;
        const toUserId=req.params.toUserId;
        //validate status,toUser
        const validStatus=["interested","ignored"];
        if(!validStatus.includes(status)){
            return res.status(404).json({
                message:"Enter valid status..."
            })
        }
        const toUser=await User.findById({_id:toUserId})
        if(!toUser){
            throw new Error("toUserId not valid");
        }
        //Sending request to yourself
        if(fromUserId.equals(toUserId)){
            throw new Error("You can't send request to yourself")
        }
        //check whether toUser can send return request
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(401).json({
                message:"Connection Request already exists"
            })
        }
        //save user
        const connectionRequest=new ConnectionRequest({
            fromUserId,toUserId,status
        })
        const data=await connectionRequest.save()
        res.json({
            message:`${req.user.firstName} is ${status} in ${toUser.firstName}`,
            Data:data
        })
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})


router.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        //take loggedInUser
        const loggedInUser=req.user
        const {status,requestId}=req.params;
        //valid the status
        const validStatus=["accepted","rejected"];
        if(!validStatus.includes(status)){
            throw new Error("Enter valid status")
        }
        //finding only interested status users
        const reviewRequest=await ConnectionRequest.findOne({
            status:"interested",toUserId:loggedInUser._id,_id:requestId
        })
        reviewRequest.status=status;
        const data= await reviewRequest.save();
        //sending response
        res.json({
            message:"Request Accepted...",
            Data:data
        });
    }
    catch(err){
        res.status(404).send("Error:"+err.message);
    }
})

module.exports=router;