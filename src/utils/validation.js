const validator=require("validator");

const validateSignUp=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Enter Valid Name")
    }
    if(firstName==lastName){
        throw new Error("Enter Valid LastName")
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Enter Valid emailId")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password")
    }
};

const validateProfileEdit=(req)=>{
    const allowedFields=["firstName","lastname","emailId","gender","about","age","skills"];
    const isEditAllowed=Object.keys(req.body).every((field)=>
        allowedFields.includes(field)
    );
    return isEditAllowed;
}

const validatePassword=(req)=>{
    const allowed=["password"];
    const isAllowed=Object.keys(req.body).every((key)=>
        allowed.includes(key)
    )
    return isAllowed;
}


module.exports={
    validateSignUp,validateProfileEdit,validatePassword
}