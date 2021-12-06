const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const payment = require('../model/payment')
const verifyToken = require('../middleware/auth')
const autoId = require('../middleware/autoId')
const checkDate = require('../function/checkDate')


//create transaction
router.post('/',verifyToken,async (req,res) => {
    const {Customer_Name,Customer_Id_Card,Phone_Number,Room_Num,Start_Date,End_Date}=req.body
    try
    {
        //find employee create transaction
        const userId = req._id
        const findUser = await user.findOne({_id:userId})
        //All good
        //Get new id for transaction
        const newTransId = await autoId('Transaction')
      
        //create transaction
        const newStartDate = new Date(Start_Date).setHours(14,0,0)
        const newEndDate = new Date(End_Date).setHours(12,0,0)
        
        /*const Customer = await customer.findOne({Customer_Id_Card})
        if(!Customer)
        {
            var newCusId = await autoId('Customer')
            const newCustomer = new customer({Customer_Id:newCusId,Customer_Name,Phone_Number})
        }*/
        const newTrans = new trans ({
        id:newTransId,Customer_Name,Customer_Id_Card,Phone_Number,Room_Num,Start_Date:newStartDate,End_Date:newEndDate,Last_Update_Id:findUser.id})
        await newTrans.save()
        await room.findOneAndUpdate({id:req.body.Room_Num},{Status:"Booked"})
        res.json({success:true,message:"Create transaction successfully!"})
    }
    catch(err)
    {
        console.log(err.message )
        res.status(400).json({success:false,message:"Internal error"})
    }
})

/*update transaction
router.patch('/',verifyToken, async(req,res)=>{
    const {id,Room_Num,Start_Date,End_Date} = req.body
    try 
    {
        const newStartDate = new Date(Start_Date).setHours(14,0,0)
        const newEndDate = new Date(End_Date).setHours(12,0,0)
        const findTrans = await checkDate(newStartDate,newEndDate,req.body.Room_Num,req.body.id)
        if(findTrans)
        {
            const lastUserUpdate = await user.findOne({_id:req._id})
            await trans.findOneAndUpdate({id},{Room_Num,Start_Date:newStartDate,End_Date:newEndDate,Last_Update_Id:lastUserUpdate.id})
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
*/
// Delete transactions
router.delete('/:id',verifyToken,async (req,res)=>{
    try
    {
        await trans.findOneAndDelete({id:req.params.id})
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
            for(let i=0;i<transList.length;i++)
            {
                transList[i] = JSON.stringify(transList[i])
                transList[i]= JSON.parse(transList[i])
                transList[i].Start_Date_Formatted = new Date(transList[i].Start_Date).toLocaleString()
                transList[i].End_Date_Formatted = new Date (transList[i].End_Date).toLocaleString()
                transList[i].Create_Date_Formatted = new Date(transList[i].Create_Date).toLocaleString()
            }
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
//Get one transation 
router.get('/getone/:id',async(req,res)=>{
    const id = req.params.id
    try
    {
        let transaction = await trans.findOne({id},{_id:0})
        transaction = JSON.stringify(transaction)
        transaction = JSON.parse(transaction)
        transaction.Start_Date_Formatted = new Date(transaction.Start_Date).toLocaleString()
        transaction.End_Date_Formatted = new Date (transaction.End_Date).toLocaleString()
        transaction.Create_Date_Formatted = new Date(transaction.Create_Date).toLocaleString()
        res.json(transaction)
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})

//customer check in 
router.patch('/check-in',verifyToken,async (req,res)=>{
    const {id,Customer_Id_Card,Start_Date,End_Date,Room_Num} = req.body
    try
    {
        const Transaction = await trans.findOne({id})
        const timeCheckin = (Transaction.Start_Date - new Date(Start_Date))/(1000*60*60)
        if(Transaction.Status==="Uncheck-in" && timeCheckin <= 9 ){

            const newPaymentId = await autoId('Payment')
            const User = await user.findOne({_id:req._id})
            const Room = await room.findOne({id:req.body.Room_Num})
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
            const Payment = new payment({id:newPaymentId,Customer_Id_Card,Create_By:User.id})
            await Payment.save()
            await payment.findOneAndUpdate({id:newPaymentId},{Surcharge:surcharge,Payment_Status:"Calculating"})
            await trans.findOneAndUpdate({id},{Payment_Id:newPaymentId,Start_Date,End_Date,Status:"Checked-in"})
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


//Show check-out payment of customer
router.patch('/check-out',verifyToken,async (req,res)=>{
    const {id,Room_Num,Payment_Id,Start_Date,End_Date} = req.body
    try
    {
        const Transaction = await trans.findOne({id})
        if(Transaction.Status==="Checked-in")
        {
            const Room = await room.findOne({id:Room_Num})
            const Payment = await payment.findOne({id:Payment_Id})
            if(Payment.Payment_Status!=="Calculated")
            {
                let total = 0
                let surcharge = 0
                //customer check-out on time or early 
                if(new Date(req.body.End_Date).getTime()===Transaction.End_Date.getTime()||new Date(req.body.End_Date).getTime()<Transaction.End_Date.getTime())
                { 
                    let priceHours = (Transaction.End_Date-Transaction.Start_Date)/(1000*60*60)
                    let priceDays = (Transaction.End_Date-Transaction.Start_Date)/(1000*3600*24)
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
                    total = total + surcharge
                }
                surcharge = Payment.Surcharge + surcharge
                await payment.findOneAndUpdate({id:req.body.Payment_Id},{Surcharge:surcharge,Total:total,Payment_Status:"Calculated"})
                await trans.findOneAndUpdate({id},{Total:total,Status_Payment:"Calculated"})
                res.json({surcharge:surcharge,total:total})
            }
            else throw new Error()
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
router.patch('/pay',verifyToken,async (req,res)=>{
    const{id,Payment_Id,Payment_Method,Room_Num} = req.body
    try{
        const transaction = await trans.findOne({id})
        if(transaction.Status==="Checked-in" && transaction.Status_Payment === "Calculated")
        {
            const User = await user.findOne({_id:req._id})
            await payment.findOneAndUpdate({id:req.body.Payment_Id},{Payment_method:Payment_Method,Payment_Status:"Paid",Create_By:User.id})
            await trans.findOneAndUpdate({id},{Payment_Method,Status:"Checked-out",Status_Payment:"Paid"})
            const updateRoom = await trans.find({$and:[{Room_Num},{$and:[{Status:{$ne:"Checked-out"}},{Status:{$ne:"Cancelled"}}]}]})
            if(updateRoom.length==0)
            {
                await room.findOneAndUpdate({id:req.body.Room_Num},{Status:"Unbooked"})
            }
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


//cancel transaction 
router.patch('/cancel/:id',async(req,res)=>{
    const id = req.params.id
    try
    {
        const transaction = await trans.findOne({id})
        if(transaction.Status==="Uncheck-in")
        {
            await trans.findOneAndUpdate({id},{Status:"Cancelled"})
            res.json({success:true,message:"Transaction has been cancelled"})
        }
        else
        { 
            throw new Error()
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error"})
    }
})
module.exports = router