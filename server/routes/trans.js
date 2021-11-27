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
const transaction = require('../model/transaction')


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
        //Get new id for transaction
        const newTransId = await autoId('Transaction')
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

// Delete transactions
router.delete('/',verifyToken,async (req,res)=>{
    const {Trans_Id}= req.body
    try
    {
        await trans.findOneAndDelete({Trans_Id})
        res.json({success:true,message:"Delete transaction successfully"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal error!"})
    }
})
//Get all transaction
router.get('/',verifyToken, async (req,res)=>{
    try{
        const transList = await trans.find()
        res.json(transList)
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})


//customer check in 
router.patch('/check-in',verifyToken,async (req,res)=>{
    const {Trans_Id,Customer_Id,Start_Date,End_Date,Room_Num} = req.body
    try
    {
        const Transaction = await trans.findOne({Trans_Id})
        const newPaymentId = autoId('Payment')
        const User = user.findOne({_id:req._id})
        const Payment = new payment({Payment_Id:newPaymentId,Customer_Id,Create_By:User.userID})
        await Payment.save()
        const Room = await room.fineOne({Room_Num})
        //check if customer check in early 
        const earlyTime = transaction.Start_Date - (new Date(Start_Date))
        if(earlyTime>0)
        {
            let surcharge
            if(earlyTime>5)
            {
                surcharge = Room.Price_per_Day*50/100
            }
            else
            {
                surcharge = Room.Price_per_Day*30/100
            }
            await payment.findOneAndUpdate({Payment_Id:newPaymentId},{Total:surcharge})
        }
        await trans.findOneAndUpdate({Trans_Id},{Start_Date,End_Date,Status:"Checked-in"})
        res.json({success:true,message:"Check-in successfully"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})


//Customer Check-out
router.patch('/payment',async (req,res)=>{
    const {Trans_Id,Room_Num,Payment_Id,Start_Date,End_Date,CostIncurr} = req.body
    try
    {
        const Transaction = await trans.findOne({Trans_Id})
        const Room = await room.fineOne({Room_Num})
        const Payment = await payment.findOne({Payment_Id})
        let total
        let surcharge
        //customer check-out ontime 
        if(new Date(req.body.End_Date)===transaction.End_Date)
        { 
            let priceHours = (new Date(End_Date)-new Date(Start_Date))/(1000*60*60)
            let priceDays = (new Date(End_Date)-new Date(Start_Date))/(1000*3600*24)
            if(priceDays>=0.8)
            {
                total = Math.round(priceDays)*Room.Price_per_Day
            }
            else if(priceHours>=1)
            {
                total = Math.round(priceHours)*Room.Price_per_Hour
            }
            else if(priceHours<1)
            {
                total = priceHours
            }
        }
        //customer check out late
        else if (new Date(req.body.End_Date)!==Transaction.End_Date)
        {
            let priceHours = (Transaction.End_Date-Transaction.Start_Date)/(1000*60*60)
            let priceDays = (Transaction.End_Date-Transaction.Start_Date)/(1000*3600*24)
            let lateTime = (new Date(req.body.End_Date)-Transaction.End_Date)/(1000*60*60)
            if(priceDays>=0.8)
            {
                total = Math.round(priceDays)*Room.Price_per_Day
            }
            else if(priceHours>=1)
            {
                total = Math.round(priceHours)*Room.Price_per_Hour
            }
            else if(priceHours<1)
            {
                total = priceHours
            }
            // Surcharge
            if(lateTime>6)
            {
                surcharge = Room.Price_per_Day
            }
            else if (lateTime >3 )
            {
                surcharge = Room.Price_per_Day*50/100            
            }
            else
            {
                surcharge  = Transaction.Price_per_Day*30/100
            }
            total = total + surcharge
        }
        total = Payment.Total + total
        await payment.findOneAndUpdate({Payment_Id},{Total:total})
        res.json({surcharge:surcharge,total:total})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})
// customer pay bills and check out 
router.post('/',verifyToken,async (req,res)=>{
    const{Payment_Id,Payment_Method} = req.body
    try{
        const User = user.fineOne({_id:req._id})
        await payment.findOneAndUpdate({Payment_Id},{Payment_Method,Status:"Paid",Create_By:User.userID})
        await trans.findOneAndUpdate({Payment_Id},{Status:"Checked-out",Last_Update_Id:User.userID})
        res.json({success:true,message:"Successful transaction payment"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
module.exports = router