const express = require('express')
const router = express.Router()
const Tweet = require('../models/tweets')
const protect=require('../middleware/protect')

router.get('/',(req,res)=>{
    Tweet.find().then((result)=>{res.status(200).json(result)}).catch(err=>res.status(500).json(err))
})

router.get('/:user',(req,res)=>{
    Tweet.find({username:req.params.user})
        .then((tweet)=>res.status(200).json(tweet))
        .catch(err=>res.status(500).json(err))
})

router.post('/',protect,async(req,res)=>{
    const {tweet,pic}=req.body;
    if(req.user.isBanned)
        return res.status(403).json({msg:"You have been banned from posting"})
    const twt = await Tweet.create({tweet,pic,user:req.user._id});
    return res.status(201).json(twt);
})

router.delete('/:tweetId',protect,async(req,res)=>{
    const {tweetId} = req.params;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        return res.status(404).json({message:"Error : 404 Tweet Not Found"});
    }
    if(tweet.user.equals(req.user._id) || req.user.isAdmin===true){
        await tweet.remove();
        return res.status(200).json({message:"Tweet Deleted Successfully"});
    }
    return res.status(401).json({message:"Not Authorized to delete Tweet"});
})

router.patch('/:tweetId',protect,async(req,res)=>{
    const {tweetId} = req.params;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        return res.status(404).json({message:"Error : 404 Tweet Not Found"});
    }
    if(tweet.user.equals(req.user._id)){
        await Tweet.findByIdAndUpdate(tweetId,req.body);
        return res.status(200).json({message:"Tweet Updated Successfully"});
    }
    return res.status(401).json({message:"Not Authorized to update Tweet"});
})

module.exports = router