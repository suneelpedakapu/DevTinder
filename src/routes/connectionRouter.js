const express=require('express');
const router=express.Router();
const{userAuth}=require("../middlewares/auth");
const ConnectionRequest=require('../models/connectionRequest');
const User=require("../models/user");


router.post('/request/send/:status/:toUserId', userAuth, async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params?.toUserId;
        const status=req.params?.status;

        // entered status is correct or not
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(401).json({
                message:"Invalid status type:"+status
            })
        }
        // checking whether toUserId is present in DB or not
        const toUser=await User.findById({_id:toUserId});
        if(!toUser){
            return res.status(401).send("User not found")
        };
        //checking fromUserId and toUserId same or not (both are not strings they are ObjectId types)
        if(fromUserId.equals(toUserId)){
            res.status(401).send("You can't send request to yourself")
        }

        //checking for existing connection request, not to send too many  times and vice versa
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId} //values interchanges to value assigned to from
            ]
        })
        if(existingConnectionRequest){
            return res.status(401).json({
                message:"Connection already exists"
            })
        }

        // creating new user 
        const connectionRequest=new ConnectionRequest({
            fromUserId,toUserId,status
        });
        //saving new user
        const data=await connectionRequest.save();

        res.json({
            message:`${req.user.firstName} is ${status} in ${toUser.firstName}`,
            Data:data
        })
    }
    catch(err){
        res.status(401).send("Error:"+err.message)
    }
})

module.exports=router;