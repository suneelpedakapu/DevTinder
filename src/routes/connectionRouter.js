const express=require('express');
const router=express.Router();

const{userAuth}=require("../middlewares/auth")

router.post('/sendingRequest',userAuth,async(req,res)=>{
    const user=req.user;
    //sending a connection request
    console.log("sending connection request")

    res.send(user.firstName+" sent request")
})

module.exports=router;