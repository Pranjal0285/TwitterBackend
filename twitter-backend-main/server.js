const http = require('http')
const dotenv = require('dotenv')
dotenv.config()
const app = require('./app')

const PORT = process.env.PORT || 3010

const server = http.createServer(app)

server.listen(PORT,()=>{
    console.log(`Listening At Port ${PORT}`)
})

