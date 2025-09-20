const express=require("express");
const router=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

router.get("/user/pendingRequests",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const pendingRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,status:"interested"
        }).populate("fromUserId","firstName lastName")
        const data=pendingRequests;
        res.json({
            message:`${loggedInUser.firstName} Pending Requests`,
            Data:data
        })
        
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

router.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        //get users with both from and to Id's
        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
        })
        .populate("fromUserId","firstName lastName")
        .populate("toUserId","firstName lastName")

        const data=connections.map((each)=>{
            if(each.fromUserId._id.toString()===loggedInUser._id.toString()){
                return each.toUserId
            }
            return each.fromUserId
        });
        res.json({
            message:`${loggedInUser.firstName} Connections...`,
            Data:data
        });

    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

router.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        //getting all sent and received requests of loggedin user
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId")
        //creating a set which doesn't takes repeated values
        const hideFromUserFeed=new Set();
        connectionRequests.forEach((each)=>{
            hideFromUserFeed.add(each.fromUserId.toString());
            hideFromUserFeed.add(each.toUserId.toString())}
        )
        //getting users which are available after below conditions
        const users=await User.find({
            $and:[{_id:{$nin: Array.from(hideFromUserFeed)}},
            {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName About")
        res.send(users)
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

module.exports=router;