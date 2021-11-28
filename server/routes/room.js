const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const verifyToken = require('../middleware/authadmin')
const autoId = require('../middleware/autoId')
const { create } = require('../model/room')


//Get all room
router.get('/',async (req,res)=>{
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
    const {Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status}= req.body
    try 
    {
        const findUser = await user.findOne({_id:req._id})
        idUserCreate = findUser.id
        const newRoom = new room({Room_Num,Room_Name,Price_per_Hour,Price_per_Night,Price_per_Day,Status,Create_By:idUserCreate})
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
        res.status(400).json({message:false,message:"Can not find the user or id input is empty!"})
    }
})

// Check room are available between two date
router.get('/checkRoom',verifyToken,async(req,res)=>{
    const {Start_Date,End_Date} = req.body
    try
    {
        const Room = await room.find({},{Room_Num:1,_id:0})
        console.log(Room)
        const arrayRoom = Object.values(Room)
        console.log(arrayRoom)
        let arrayValidRoom = []
        for(let i=0;i<arrayRoom.length;i++)
        {
            let checkRoom = await trans.find(
                {$or:[
                    {$and:
                    [{Room_Num:arrayRoom[i]},
                        {$or: [{Start_Date:{$lte: new Date(Start_Date)}},{End_Date:{$gte: new Date(Start_Date)}}]}]},
                    {$and:
                    [{Room_Num:arrayRoom[i]},
                        {$or: [{Start_Date:{$lte: new Date(End_Date)}},{End_Date:{$gte: new Date(End_Date)}}]}]}
                    ]
                    })
            if(checkRoom.length==0)
            {
                arrayValidRoom[i]=arrayRoom[i]
            }
        }
        if(arrayValidRoom.length>0)
        {
            return res.json({success:true,message:"List of room available has been sent",listRoom:arrayValidRoom})
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