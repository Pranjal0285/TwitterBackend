const express=require("express")
const joi=require('joi').extend(require('@joi/date'));
const bcrypt=require('bcrypt')
const router=express.Router();
const User=require("../models/user");
const genToken = require("../Token");

const SignupSchema=joi.object(
    {
        name:joi.string().required(),
        username:joi.string().min(4).required(),
        email:joi.string().email(),
        password:joi.string().required().min(6),
        phone:joi.string().min(10).max(10),
        DOB:joi.date().required().format("YYYY/MM/DD").raw(),
    }
).or("email","phone")

router.post("/signup",async(req,res)=>{
    const {name,username,email,password,DOB,phone}=req.body;
    var {error}=await SignupSchema.validate({name,username,email,password,DOB,phone});
    if(error){
        res.status(400);
        error=error.details[0].message.replace( /\"/g, "" );
        return res.json({message:error});
    }
    const keyword={
        $or: [
            {
                $and:[
                    {email:{$eq:email}},
                    {email:{$ne:null}}
                ]
            },
            {
                $and:[
                    {username:{$eq:username}},
                    {username:{$ne:null}}
                ]
            },
            {
                $and:[
                    {phone:{$eq:phone}},
                    {phone:{$ne:null}}
                ]
            }
        ]
    }
    const userExist=await User.findOne(keyword)
    if(userExist){
        res.status(409)
        if(email!==undefined && userExist.email===email){
            return res.json({message:'Another account is using the same email.'});
        }
        else if(username!==undefined && userExist.username===username){
            return res.json({message:"This username isn't available. Please try another."})
        }
        else{
            return res.json({message:"Another account is using the same Phone number"})
        }
    }
    const saltRounds=10;
    var encryptPassword=await bcrypt.hash(password,saltRounds);
    var user=await User.create({name,username,email,password:encryptPassword,DOB:new Date(DOB),phone});
    const id=user._id;
        user=user._doc;
        //deleting unneccesary object properties
        delete user._id;delete user.password;delete user.createdAt;delete user.updatedAt;delete user.__v;delete user.isAdmin;delete user.isBanned;
    return res.status(201).json({
        ...user,
        token:await genToken(id),
    });
})

const loginSchema=joi.object({
    username:joi.string(),
    email:joi.string().email(),
    phone:joi.number().min(1000000000).max(9999999999),
    password:joi.string().required().min(8),
}).or("username","email","phone");

router.post('/login',async(req,res)=>{
    const {email,phone,username,password}=req.body;
    var {error}=await loginSchema.validate({email,phone,username,password});
    if(error){
        res.status(400);
        error=error.details[0].message.replace( /\"/g, "" );
        return res.json({message:error});
    }
    const keyword={
        $or: [
            {
                $and:[
                    {email:{$eq:email}},
                    {email:{$ne:null}}
                ]
            },
            {
                $and:[
                    {username:{$eq:username}},
                    {username:{$ne:null}}
                ]
            },
            {
                $and:[
                    {phone:{$eq:phone}},
                    {phone:{$ne:null}}
                ]
            }
        ]
    }
    var user=await User.findOne(keyword);
    if(user.isBanned)
    {
        return res.status(401).json({message:'Your Account Is Banned'})
    }
    if(user && await bcrypt.compare(password,user.password)){
        const id=user._id;
        user=user._doc;
        //deleting unneccesary object properties
        delete user._id;delete user.password;delete user.createdAt;delete user.updatedAt;delete user.__v;delete user.isAdmin;delete user.isBanned;
        return res.status(200).json({
            ...user,
            token:await genToken(id),
        });
    }
    else{
        return res.status(401).json({message:'Invalid Username/Email/Phone Number or Password'});
    }
})


module.exports=router;
