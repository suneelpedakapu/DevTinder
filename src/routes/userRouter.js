const express=require("express");
const router=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");

router.get("/user/pendingRequests",userAuth,async(req,res)=>{
    try{
        //get logged in user
        const loggedInUser=req.user;
        //finding the requests
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,status:"interested"
        }).populate("fromUserId","firstName lastName");//.populate("fromUserId",["firstName","lastName"]);
        
        // const data=connctionRequests.map((eachObject)=>eachObject.fromUserId); 
        res.json({
            message:"Requests Fetched Successfully",
            Data:connectionRequests
        })
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

router.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName")
        .populate("toUserId","firstName lastName")

        // getting fromUserId from each object of array connections 
        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        });

        res.json({
            message:`${loggedInUser.firstName} connections `,
            Data:data
        })
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

module.exports=router;