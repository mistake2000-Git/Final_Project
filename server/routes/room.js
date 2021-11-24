const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const verifyToken = require('../middleware/authadmin')
const autoId = require('../middleware/autoId')
const { create } = require('../model/room')

//Add new room
router.post('/',verifyToken, async (req,res)=>{
    const {Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status}= req.body
    try 
    {
        const findUser = await user.findOne({_id:req._id})
        idUserCreate = findUser.userID
        const newRoom = new room({Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status,Create_By:idUserCreate})
        await newRoom.save()
        res.json({success:true,message:"Create Room successfully"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Room ID existing "})
    }
})


//Delete room
router.delete('/',async (req,res)=>{
    const {Room_Num} = req.body
    try
    {
        const checkDelete = await room.findOneAndDelete({Room_Num})
        if(!checkDelete)
            throw new Error()
        res.json({success:true,message:"Delete Successfully"})
    }
    catch(err)
    {
        res.status(400).json({success:false,message:"Can't not find room to delete"})
    }
})

//Update room
router.patch('/',verifyToken, async(req,res)=>{
    const {Room_Num} = req.body
    try 
    {
        const Room = await room.findOne({Room_Num})
        if(!Room)
        {
            return res.status(400).json({success:false,message:"Can not find the room to update"})
        }
        const roomProperty = Object.keys(req.body)
        const roomValues = Object.values(req.body)
        for(let i=1;i<roomProperty.length;i++)
        {
            let property = roomProperty[i]
            let values = roomValues[i]
            let filter = {Room_Num}
            let update = {property:values}
            update[property] = update['property']
            await room.updateOne(filter,update)
        }
        res.json({success:true,message:"Update room infomation successfully"})
    }
    catch(err)
    {
        res.status(400).json({message:false,message:"Can not find the user or userID input is empty!"})
    }
})



module.exports= router