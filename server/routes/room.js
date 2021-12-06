const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const verifyToken = require('../middleware/authadmin')
const verifyTokenEmp = require('../middleware/auth')
const autoId = require('../middleware/autoId')
const { create } = require('../model/room')

//Get one room
router.get('/getone/:id',verifyToken,async(req,res)=>{
    const id = req.params.id
    try
    {
        const Room = await room.findOne({id})
        if(Room)
        {
            res.json(Room)
        }
        else throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Room not found or Internal Error!"})
    }
})
//Get all room
router.get('/',verifyTokenEmp,async (req,res)=>{
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
        res.status(404).json({message:false,message:"Can not find the room or id input is empty!"})
    }
})

// Check room are available between two date
router.patch('/checkRoom',async(req,res)=>{
    const {Start_Date,End_Date} = req.body
    try
    {   
        console.log(new Date(Start_Date).toLocaleDateString())
        console.log(new Date(End_Date).toLocaleDateString())
        /*if(Start_Date!=null && End_Date!=null)
        {
        
        }*/
        let startDate = new Date(req.body.Start_Date).toLocaleDateString()
        let endDate = new Date(req.body.End_Date).toLocaleDateString()
        if(new Date(Start_Date).getTime()==new Date(End_Date).getTime())
        {
            startDate = new Date(Start_Date)
            startDate.setHours(0,0,0)
            endDate = new Date(End_Date)
            endDate.setHours(23,59,0)
        }
        else
        {
            startDate = new Date(Start_Date)
            console.log(startDate)
            startDate.setHours(14,0,0)
            console.log(startDate)
            endDate = new Date(End_Date)
            endDate.setHours(12,0,0)
        }
        const Room = await room.find({},{_id:0})
        console.log("asda")
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
            return res.json([])
        }

    }
    catch(err)
    {
        console.log(err.message)
        res.status(404).json({success:false,message:"Internal Error"})
    }
})

module.exports= router