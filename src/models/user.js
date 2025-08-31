const mongoose=require("mongoose");

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
        lowercase:true,
        validate(value){
            if(!value.endsWith("@gmail.com")){
                throw new Error("Provide valid email adress")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:40
    },
    password:{
        type:String 
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


module.exports=mongoose.model("User",userSchema);
