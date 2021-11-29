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
    const {Customer_Name,Customer_Id_Card,Phone_Number,Room_Num,Start_Date,End_Date}=req.body
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
        const userId = req._id
        const findUser = await user.findOne({_id:userId})
        //All good
        //Get new id for transaction
        const newTransId = await autoId('Transaction')
      
        //create transaction
        const newStartDate = Start_Date+" 2:00:00 PM"
        const newEndDate = End_Date+" 12:00:00 AM"
        
        /*const Customer = await customer.findOne({Customer_Id_Card})
        if(!Customer)
        {
            var newCusId = await autoId('Customer')
            const newCustomer = new customer({Customer_Id:newCusId,Customer_Name,Phone_Number})
        }*/
        const newTrans = new trans ({
        Trans_Id:newTransId,Customer_Name,Customer_Id_Card,Phone_Number,Room_Num,Start_Date:newStartDate,End_Date:newEndDate,Last_Update_Id:findUser.id})
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
router.delete('/:id',verifyToken,async (req,res)=>{
    try
    {
        await trans.findOneAndDelete({Trans_Id:req.params.id})
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
        const transList = await trans.find()
        if(transList)
        {
            return res.json(transList)
        }
        else throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})


//customer check in 
router.patch('/check-in',verifyToken,async (req,res)=>{
    const {Trans_Id,Customer_Id_Card,Start_Date,End_Date,Room_Num} = req.body
    try
    {
        const Transaction = await trans.findOne({Trans_Id})
        console.log(Transaction.Start_Date.toLocaleString())
        const timeCheckin = (Transaction.Start_Date - new Date(Start_Date))/(1000*60*60)
        if(Transaction.Status==="Uncheck-in" && timeCheckin <= 9 ){

            const newPaymentId = await autoId('Payment')
            const User = await user.findOne({_id:req._id})
            const Payment = new payment({Payment_Id:newPaymentId,Customer_Id_Card,Create_By:User.id})
            await Payment.save()
            const Room = await room.findOne({Room_Num})
            //check if customer check in early 
            let surcharge = 0  
            if(timeCheckin>5)
            {
                surcharge = Room.Price_per_Day*50/100
            }
            else if(timeCheckin>0)
            {
                surcharge = Room.Price_per_Day*30/100
            }
            await payment.findOneAndUpdate({Payment_Id:newPaymentId},{Total:surcharge,Payment_Status:"Calculating"})
            await trans.findOneAndUpdate({Trans_Id},{Payment_Id:newPaymentId,Start_Date,End_Date,Status:"Checked-in",Total:surcharge})
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
router.patch('/payment',verifyToken,async (req,res)=>{
    const {Trans_Id,Room_Num,Payment_Id,Start_Date,End_Date,CostIncurr} = req.body
    try
    {
        const Transaction = await trans.findOne({Trans_Id})
        if(Transaction.Status==="Checked-in")
        {
            console.log('asdf')
            const Room = await room.findOne({Room_Num})
            const Payment = await payment.findOne({Payment_Id})
            if(Payment.Payment_Status!=="Calculated")
            {
                let total = 0
                let surcharge = 0
                //customer check-out on time or early 
                if(new Date(req.body.End_Date).getTime()===Transaction.End_Date.getTime()||new Date(req.body.End_Date).getTime()<Transaction.End_Date.getTime())
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
                await payment.findOneAndUpdate({Payment_Id},{Total:total,Payment_Status:"Calculated"})
                await trans.findOneAndUpdate({Trans_Id},{Total:total,Status_Payment:"Calculated"})
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
    const{Trans_Id,Payment_Id,Payment_Method} = req.body
    try{
        const transaction = await trans.findOne({Trans_Id})
        console.log(transaction)
        if(transaction.Status==="Checked-in" && transaction.Status_Payment === "Calculated")
        {
            const User = await user.findOne({_id:req._id})
            await payment.findOneAndUpdate({Payment_Id},{Payment_Method,Payment_Status:"Paid",Create_By:User.id})
            await trans.findOneAndUpdate({Trans_Id},{Status:"Checked-out",Status_Payment:"Paid"})
            res.json({success:true,message:"Successful transaction payment"})
        }
        else 
        {
             throw new Error()
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
module.exports = router