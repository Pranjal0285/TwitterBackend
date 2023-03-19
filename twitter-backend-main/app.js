const express=require('express');
const app=express();
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const tweetHandler = require('./routes/tweets')
const userRouter = require('./routes/userRouter')
const followRouter = require('./routes/follow')
const followers=require('./routes/followers')
const following=require('./routes/following')
const censorHandler = require('./routes/censor')

//body parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const mongoose = require('mongoose');
const follow = require('./models/follow');
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGOOSE)
    .then(()=>console.log("Connected to MonogDB"))
    .catch(err=>console.log(err))

app.use(morgan('dev'))

app.use('/tweets',tweetHandler)
app.use('/auth',userRouter)
app.use('/censor',censorHandler)
app.use('/follow',followRouter)
app.use('/followers',followers)
app.use('/following',following)
app.use('/',(req,res)=>{
    res.status(200).send("Welcome to Home Route");
})


module.exports=app;