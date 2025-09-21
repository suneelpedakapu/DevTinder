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
        //get accepted connections of logIn user
        const connections=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName")
        .populate("toUserId","firstName lastName")

        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

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
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50? 50:limit;
        const skip=(page-1)*limit;
        //finding all the requested connections,whether interested or ignored
        const connections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        //creating set to keep connections in it
        const hideFromFeed=new Set();
        //adding these in set
        connections.forEach((each)=>{
            hideFromFeed.add(each.fromUserId._id.toString());
            hideFromFeed.add(each.toUserId._id.toString());
        })
        //now getting the feed
        const userFeed=await User.find({
            $and:[
                {_id:{$nin: Array.from(hideFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName About").skip(skip).limit(limit);

        res.send(userFeed)
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
})

module.exports=router;