const express=require('express')
const protect = require('../middleware/protect');
const router=express.Router();
const User = require('../models/user')
const Follow=require('../models/follow')
router.get('/:username',protect,async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username});
    if(user.isBanned)
    {
        res.status(201).json({Message:'This User Is Banned'});
    }
    var follower=await Follow.find({follow:user._id}).populate({
        path:'user',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -DOB -isBanned'
    })
    follower=follower.map((user)=>{
        return user.user;
    })
    res.status(201).json(follower);
})

module.exports=router;