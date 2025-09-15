const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String ,
        required:true,
        trim:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:4,
        maxLength:50
    },
    emailId:{
        type:String,
        required:true ,
        unique:true,
        trim:true,
        isLowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Provide valid email address")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:40
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password")
            }
        }
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender not valid")
            }
        }
    },
    About:{
        type:String,
        default:"This is a default about"
    },
    skills:{
        type:["string"],
        validate(values){
            if(values.length>5){
                throw new Error("Skills should not Exceed more than 5")
            }
        }
    }
},
{timestamps:true});

userSchema.methods.validPassword=async function(passwordByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(passwordByUser,passwordHash);

    return isPasswordValid;
}

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"Suneel@143");
    return token;
}



module.exports=mongoose.model("User",userSchema);
