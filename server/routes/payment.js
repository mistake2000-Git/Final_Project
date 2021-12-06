const express =  require('express')
const router = express.Router()
const payment = require("../model/payment")

//get one payment
router.get("/getone/:id",async(req,res)=>{
    const id = req.params.id
    try
    {
        let Payment = await payment.findOne({id})
        if(Payment)
        {
            Payment = JSON.stringify(Payment)
            Payment = JSON.parse(Payment)
            Payment.Create_Date_Formatted = new Date(Payment.Create_Date).toLocaleString()
            res.json(Payment)
        }
        else
            throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
//get all payment 
router.get("/",async(req,res)=>{
    try{
        let Paylist = await payment.find()
        if(Paylist)
        {
            for(let i = 0;i<Paylist.length;i++)
            {
                Paylist[i] = JSON.stringify(Paylist[i])
                Paylist[i] = JSON.parse(Paylist[i])
                Paylist[i].Create_Date_Formatted = new Date(Paylist[i].Create_Date).toLocaleString()
            }
            res.json(Paylist)
        }
        else
            throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
module.exports= router