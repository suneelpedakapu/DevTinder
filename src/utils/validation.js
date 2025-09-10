const validator=require("validator");

const validateSignUp=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName && !lastName){
        throw new Error("Enter Valid Name")
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Enter Valid emailId")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password")
    }
};

module.exports={
    validateSignUp,
}