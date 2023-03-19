const mongoose = require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false, 
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    DOB:{
        type:Date
    },
    pic:{
        type:String,
        default:'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
    } 
},{
    timestamps:true,
})

module.exports=mongoose.model("User",UserSchema)