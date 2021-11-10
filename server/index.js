const express=require('express')
const mongoose = require('mongoose')

const URL = 'mongodb+srv://admin:cRH5G-9%21%23AX8c9%24@webapp.mfwqf.mongodb.net/Hotel_Management?authSource=admin&replicaSet=atlas-angb4h-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const PORT = process.env.PORT||5000
const connectDB = async () => {
    try {
      await mongoose.connect(
        URL,
        { 
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      )
      app.listen(PORT,()=>console.log("Server is started at 3000 PORT"))
      console.log('Connected to mongoDB')
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
connectDB()
const app=express()


