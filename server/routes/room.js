const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const verifyToken = require('../middleware/authadmin')

//Add new room
router.post('/',verifyToken, async (req,res)=>{
    const {Room_Id,Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status,Create_By}= req.body
    try 
    {
        const checkEmp = await user.findOne({userID:req.body.Create_By})
        if(!checkEmp)
        {
            return res.status(400).json({success:false,message:"The employee not define"})
        }
        const newRoom = new room({Room_Id,Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status,Create_By})
        await newRoom.save()
        res.json({success:true,message:"Create Room successfully"})
    }
    catch(err)
    {
        res.status(400).json({success:false,message:"Room ID existing "})
    }
})


//Delete room
router.delete('/',async (req,res)=>{
    const {Room_Id} = req.body
    try
    {
        const checkDelete = await room.findOneAndDelete({Room_Id})
        if(!checkDelete)
            throw new Error()
        res.json({success:true,message:"Delete Successfully"})
    }
    catch(err)
    {
        res.json({success:false,message:"Can't not find room to delete"})
    }
})

//Update room
router.patch('/',verifyToken, async(req,res)=>{
    const {Room_Id} = req.body
    try 
    {
        const Room = await room.findOne({Room_Id})
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
            let filter = {Room_Id}
            let update = {property:values}
            update[property] = update['property']
            await room.updateOne(filter,update)
        }
        res.json({success:true,message:"Update room infomation successfully"})
    }
    catch(err)
    {
        res.json({message:false,message:"Can not find the user or userID input is empty!"})
    }
})



module.exports= router