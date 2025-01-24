import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
//import apiRouter from './router/apiRouter.js'
import apiRouter from './router1/apiRouter.js'
import mongoose from 'mongoose'

const app = express()
dotenv.config({path:'./config/config.env'})
const port = process.env.PORT
const host = process.env.LOCAL_HOST
//const mongodb_url = process.env.MONGODB_URL

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));
  

//use to read data from form or body
app.use(express.json())

app.get('/',(req,resp)=>{
    resp.json({'msg':'app root'})
})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api',apiRouter)

app.listen(8000,'127.0.0.1',(err)=>{
    if(err) throw err
    console.log(`server is running...http://${port}/${host}`)
})