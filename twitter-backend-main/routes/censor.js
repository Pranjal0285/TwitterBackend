const express = require('express')
const router = express.Router()
const protect=require('../middleware/protect')
const User = require('../models/user')

router.patch('/ban/:username',protect,(req,res)=>{
    console.log("ban route")
    if(!req.user.isAdmin)
        return res.status(403).json({msg:"You don't have rights to ban someone!"})
    const username = req.params.username
    User.findOne({username:username})
        .then((bannedUser)=>{
            if(!bannedUser.isBanned){
                User.findOneAndUpdate({username:username},{isBanned:true})
                    .then(()=>{
                        res.status(200).json({msg:"User banned from posting"})
                    })
            }
            else{
                return res.status(400).json({msg:"User already banned"})
            }
        }).catch(err=>{
            console.log(err)
            res.status(500).json({msg:"Server error"})
        })
})

router.patch('/unban/:username',protect,(req,res)=>{
    if(!req.user.isAdmin)
        return res.status(403).json({msg:"You don't have rights to unban someone!"})
    const username = req.params.username
    User.findOne({username})
        .then((bannedUser)=>{
            if(bannedUser.isBanned){
                User.findOneAndUpdate({username},{isBanned:false})
                    .then(()=>res.status(200).json({msg:"User unbanned from posting"}))
            }
            else{
                return res.status(400).json({msg:"User was not banned"})
            }
        }).catch(err=>res.status(500).json({msg:"Server error"}))
})

module.exports = router