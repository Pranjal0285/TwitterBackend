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
    var followings=await Follow.find({user:user._id}).populate({
        path:'follow',
        select:'-password -createdAt -updatedAt -isAdmin -_id -__v -email -DOB -isBanned'
    })
    followings=followings.map((user)=>{
        return user.follow;
    })
    res.status(201).json(followings);
})

module.exports=router;