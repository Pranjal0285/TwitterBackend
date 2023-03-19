const express=require('express');
const router=express.Router();
const protect=require('../middleware/protect');
const User = require('../models/user');
const Follow=require('../models/follow')
router.post('/:username',protect,async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    if(req.user.username==username)
    {
        return res.status(401).json({message:'You cannot follow yourself'})
    }
    if(user.isBanned)
    {
        return res.status(401).json({message:'You Cannot Follow This User'});
    }
    var follow=await Follow.findOne({user:req.user._id,follow:user._id}).populate({
        path:'user follow',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    if(follow){
        return res.status(201).json(follow);
    }
    follow=await Follow.create({user:req.user._id,follow:user._id});
    follow=await Follow.findById(follow._id).populate({
        path:'user follow',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -dob'
    })
    res.status(201).json(follow);
})

router.delete('/:username',protect,async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    if(user.isBanned)
    {
        return res.status(401).json({message:'This User Is Banned'});
    }
    var follow=await Follow.findOne({user:req.user._id,follow:user._id});
    if(follow){
        await follow.remove();
        return res.status(201).json({message:`Unfollows Successfully ${username}`});
    }
    res.status(401);
    throw new Error(`You never follows ${username}`);
})

module.exports=router;