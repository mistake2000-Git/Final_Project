const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const verifyToken = require('../middleware/authadmin')
const autoId = require('../middleware/autoId')
const { create } = require('../model/room')


//Get all room
router.get('/',verifyToken,async (req,res)=>{
    try
    {
        const Room = await room.find()
        res.json(Room)
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
//Add new room
router.post('/',verifyToken, async (req,res)=>{
    const {id,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status}= req.body
    try 
    {
        const findUser = await user.findOne({_id:req._id})
        idUserCreate = findUser.id
        const newRoom = new room({id,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status,Create_By:idUserCreate})
        await newRoom.save()
        res.json({success:true,message:"Create Room successfully"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Room id existing "})
    }
})


//Delete room
router.delete('/:id',verifyToken,async (req,res)=>{
    try
    {
        const checkDelete = await room.findOneAndDelete({id:req.params.id})
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
    const {id} = req.body
    try 
    {
        const Room = await room.findOne({id})
        if(!Room)
        {
            return res.status(400).json({success:false,message:"Can not find the room to update"})
        }
        const roomProperty = Object.keys(req.body)
        const roomValues = Object.values(req.body)
        for(let i=1;i<roomProperty.length;i++)
        {
            if(roomValues[i]!="")
            {
                let property = roomProperty[i]
                let values = roomValues[i]
                let filter = {id}
                let update = {property:values}
                update[property] = update['property']
                await room.updateOne(filter,update)
            }
        }
        res.json({success:true,message:"Update room infomation successfully"})
    }
    catch(err)
    {
        res.status(400).json({message:false,message:"Can not find the user or id input is empty!"})
    }
})

// Check room are available between two date
router.patch('/checkRoom',verifyToken,async(req,res)=>{
    const {Start_Date,End_Date} = req.body
    try
    {   
        let startDate,endDate
        if(new Date(Start_Date).getTime()==new Date(End_Date).getTime())
        {
            startDate = new Date(Start_Date).setHours(0,0,0)   
            endDate = new Date(End_Date).setHours(23,59,0)
        }
        else
        {
            startDate = new Date(Start_Date).setHours(14,0,0)
            endDate = new Date(End_Date).setHours(12,0,0)
        }
        const Room = await room.find({},{_id:0})
        let arrayValidRoom = []
        for(let i=0;i<Room.length;i++)
        {
            let checkRoomInTwoDate = await trans.find({$and:[{$and:[{Status:{$ne:"Checked-out"}},{Status:{$ne:"Cancelled"}}]},{$and:[{Room_Num:Room[i].id},
                {$or:[{$and:[{Start_Date:{$lte:startDate}},{End_Date:{$gte:startDate}}]},
                {$and:[{Start_Date:{$lte:endDate}},{End_Date:{$gte:endDate}}]}]}]}]})

            let checkRoomOverTwoDate = await trans.find({$and:[{$and:[{Status:{$ne:"Checked-out"}},{Status:{$ne:"Cancelled"}}]},{$and:[{Room_Num:Room[i].id},
                {$and:[{Start_Date:{$gt:startDate}},{End_Date:{$lt:endDate}}]}]}]})
            
            if(checkRoomInTwoDate.length==0 && checkRoomOverTwoDate.length==0)
            {
                arrayValidRoom.push(Room[i])
            }
        }
        if(arrayValidRoom.length>0)
        {
            return res.json(arrayValidRoom)
        }
        else
        {
            return res.json({success:false,message:"There are no room available"})
        }

    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})

module.exports= router