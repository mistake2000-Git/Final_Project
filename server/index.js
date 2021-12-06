const express=require('express')
const mongoose = require('mongoose')
const authRouter = require(__dirname+'/routes/auth')


const URL = 'mongodb+srv://admin:cRH5G-9%21%23AX8c9%24@webapp.mfwqf.mongodb.net/Hotel_Management?authSource=admin&replicaSet=atlas-angb4h-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const PORT = process.env.PORT||5000
const app=express()
const cors = require('cors')
app.use(cors())
const connectDB = async () => {
    try {
      await mongoose.connect(
        URL,
        { 
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      )
      app.listen(PORT,()=>console.log("Server is started at 5000 PORT"))
      console.log('Connected to mongoDB')
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
connectDB()

app.use(express.json())

app.use('/api/auth',authRouter)
const manageRouter = require(__dirname+'/routes/manage')
app.use('/api/manage',manageRouter)
const roomRouter = require(__dirname+'/routes/room')
app.use('/api/room',roomRouter)

const transRouter = require(__dirname+'/routes/trans')
app.use('/api/trans',transRouter)
const paymentRouter = require(__dirname+'/routes/payment')
app.use('/api/payment',paymentRouter)

app.use('/docs',express.static('./Public/docs'))
app.get('/docs',(req,res)=>{
  res.sendFile(__dirname+'/Public/docs/index.html')
})