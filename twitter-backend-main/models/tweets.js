const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    tweet:{
        type:String,
    },
    pic:{
        type:String,
    }
},
{
    timestamps:true,
})

module.exports = mongoose.model('Tweet',tweetSchema)