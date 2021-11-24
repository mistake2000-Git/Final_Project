const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const payment = require('../model/payment')
const customer = require('../model/customer')
const verifyToken = require('../middleware/auth')
const autoId = require('../middleware/autoId')
const checkDate = require('../function/checkDate')

router.get('/',async (req,res)=>{
    const checkDate = await trans.find({Start_Date:{$lt:"2021-11-16 8:01:00 AM"}})
    console.log(checkDate)
    res.json(checkDate)
})

//create transaction
router.post('/',verifyToken,async (req,res) => {
    const {Customer_Id,Room_Num,Start_Date,End_Date}=req.body
    try
    {
        //check room available
        const checkRoom = await checkDate(req.body.Start_Date,req.body.End_Date,req.body.Room_Num)
        //checkRoomDate = await transaction.findOne(Room_Num)
        console.log(checkRoom)
        if (!checkRoom||checkRoom==false)
        {   
            return res.status(400).json({success:false,message:"The room number is wrong or room was booked! "})
        }
        //find employee create transaction
        const userId = req._id
        const findUser = await user.findOne({_id:userId})
        //All good
        //Get new id for transaction and payment
        const newTransId = await autoId('Transaction')
        const newPayId = await autoId('Payment')    
        //create transaction
        const newTrans = new trans ({Trans_Id:newTransId,Customer_Id,Room_Num,Start_Date,End_Date,Payment_Id:newPayId,Last_Update_Id:findUser.userID})
        await newTrans.save()   
        await room.findOneAndUpdate({Room_Num},{Status:"Booked"})
        const temptrans = await trans.findOne({Trans_Id:"TRANS_01"})
        console.log(temptrans.Start_Date.toString())   
        res.json({success:true,message:"Create transaction successfully!"})
    }
    catch(err)
    {
        console.log(err.message )
        res.json({success:false,message:"Internal error"})
    }
})

//update transaction
router.patch('/',verifyToken, async(req,res)=>{
    const {Trans_Id,Room_Num,Start_Date,End_Date} = req.body
    try 
    {
        const findTrans = await checkDate(req.body.Start_Date,req.body.End_Date,req.body.Room_Num,req.body.Trans_Id)
        if(findTrans)
        {
            const lastUserUpdate = await user.findOne({_id:req._id})
            await trans.findOneAndUpdate({Trans_Id},{Room_Num,Start_Date,End_Date,Last_Update_Id:lastUserUpdate.userID})
            res.json({success:true,message:"Update successfully"})
        }
        else
        {
            res.status(400).json({success:false,message:"The start date or end date of transaction is not valid"})
        }   
    }
    catch(err)
    {
        console.log(err.message)
        res.json({message:false,message:"Internal Error"})
    }
})


module.exports = router