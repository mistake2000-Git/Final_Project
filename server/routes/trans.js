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
        if (!checkRoom||checkRoom==false)
        {   
            return res.status(400).json({success:false,message:"The room number is wrong or room was booked! "})
        }
        //find employee create transaction
        const id = req._id
        const findUser = await user.findOne({_id:id})
        //All good
        //Get new id for transaction
        const newTransId = await autoId('Transaction')
        //create transaction
        const newStartDate = Start_Date+" 2:00:00 PM"
        const newEndDate = End_Date+" 12:00:00 AM"
        const newTrans = new trans ({Trans_Id:newTransId,Customer_Id,Room_Num,Start_Date:newStartDate,End_Date:newEndDate,Last_Update_Id:findUser.id})
        await newTrans.save()
        await room.findOneAndUpdate({Room_Num},{Status:"Booked"})
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
            await trans.findOneAndUpdate({Trans_Id},{Room_Num,Start_Date,End_Date,Last_Update_Id:lastUserUpdate.id})
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
    try
    {
        /*let transList = await trans.find()
        let transaction = []
        const key = Object.keys(transList[0])
        /*for(let i=0;i<transList.length;i++)
        {
            let temp = new Object()
            for(let j = 0;j<key.length;j++)
            {
                if(key[j]==='Star_Date'||key[j]==='End_Date'||key[j]==='Create_Date')
                    temp.key[j] = transList[i].key.toLocaleString()
                else
                    temp.key[j] = transList[i].key
            }
            transaction.push(temp)
        }
        console.log(key)
        console.log(transList[0].Start_Date)
        res.json(transList[1].Start_Date)*/
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
        if(Transaction.Status==="Uncheck-in"){

            const newPaymentId = await autoId('Payment')
            const User = await user.findOne({_id:req._id})
            const Payment = new payment({Payment_Id:newPaymentId,Customer_Id,Create_By:User.id})
            await Payment.save()
            const Room = await room.findOne({Room_Num})
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
            await trans.findOneAndUpdate({Trans_Id},{Payment_Id:newPaymentId,Start_Date,End_Date,Status:"Checked-in"})
            res.json({success:true,message:"Check-in successfully"})
        }
        else 
            throw new Error()
        }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})


//Show payment of customer
router.patch('/payment',async (req,res)=>{
    const {Trans_Id,Room_Num,Payment_Id,Start_Date,End_Date,CostIncurr} = req.body
    try
    {
        const Transaction = await trans.findOne({Trans_Id})
        if(Transaction.Status==="Checked-in")
        {
            const Room = await room.findOne({Room_Num})
            const Payment = await payment.findOne({Payment_Id})
            if(Payment.Status!=="Calculated")
            {
                let total = 0
                let surcharge = 0
                //customer check-out on time 
                if(new Date(req.body.End_Date).getTime()===Transaction.End_Date.getTime())
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
                else if (new Date(req.body.End_Date).getTime()!==Transaction.End_Date.getTime())
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
                    total = total + surcharge+ CostIncurr
                }
                console.log(total)
                total = Payment.Total + total
                await payment.findOneAndUpdate({Payment_Id},{Total:total,Status:"Calculated"})
                res.json({surcharge:surcharge,total:total})
            }
    }
    else 
        throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})
// customer pay bills and check out 
router.patch('/check-out',verifyToken,async (req,res)=>{
    const{Payment_Id,Payment_Method} = req.body
    try{
        const User = user.findOne({_id:req._id})
        await payment.findOneAndUpdate({Payment_Id},{Payment_Method,Payment_Status:"Paid",Create_By:User.id})
        await trans.findOneAndUpdate({Payment_Id},{Status:"Checked-out",Last_Update_Id:User.id})
        res.json({success:true,message:"Successful transaction payment"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
module.exports = router