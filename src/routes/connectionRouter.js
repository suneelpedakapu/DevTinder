const express=require("express");
const router=express.Router();
const ConnectionRequest=require("../models/connectionRequest");
const {userAuth}=require("../middlewares/auth");
const User=require("../models/user");


router.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params?.toUserId;
        const status=req.params?.status;

        //checking status is valid or not
        const statusValid=["ignored","interested"];
        if(!statusValid.includes(status)){
            return res.status(401).json({
                message:"Invalid status type:"+status,
            })
        }

        //checking toUserId is present in DB or not
        const toUser=await User.findById({_id:toUserId})
        if(!toUser){
            return res.status(401).send("toUserId not found...")
        }

        if(fromUserId.equals(toUserId)){
            throw new Error("You can't send request to yourself")
        }
        
        //checking whether the reciever can also send request or not
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(401).json({
                message:"Connection already exists..."
            })
        }


        const connectionRequest=new ConnectionRequest({
            fromUserId,toUserId,status
        })
        //saving new user
        const data=await connectionRequest.save();

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
        //take loggedin user
        const loggedInUser=req.user;
        const {status,requestId}=req.params;
        //validating status
        const validStatus=["accepted","rejected"];
        if(!validStatus.includes(status)){
            return res.status(404).json({
                message:"Status isn't valid"
            })
        }
        //getting details using findone
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,status:"interested",toUserId:loggedInUser._id
        })
        //saving user
        connectionRequest.status=status;
        const data= await connectionRequest.save();
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