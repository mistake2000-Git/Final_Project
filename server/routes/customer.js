const express = require('express')
const router = express.Router();
const user = require('../model/user')
const autoId = require('../middleware/autoId');
const verifyTokenEmp = require('../middleware/auth')
const customer  = require('../model/customer')
const trans = require('../model/transaction')
const payment = require('../model/payment')

//Get all customer
router.get('/',async(req,res)=>
{
    try
    {   
        const customerList = await customer.find()
        if(customerList)
        {
            res.json(customerList)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error !"})
    }
})

//Get one customer
router.get('/getone/:phoneNumber',async(req,res)=>{
    const Phone_Number = req.params.phoneNumber
    try
    {
        const Customer = await customer.findOne({Phone_Number})
        if(Customer)
        {
            res.json(Customer)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error !"})
    }
})

//Get transaction of customer
router.get('/getCustomerTrans/:phoneNumber',async(req,res)=>{
    const Phone_Number = req.params.phoneNumber
    try
    {
        const TransList = await trans.find({Phone_Number})
        if(TransList)
        {
            res.json(TransList)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error!"})
    }
})

//Get payment of customer
router.get('/getCustomerPays/:phoneNumber',async(req,res)=>{
    const Phone_Number = req.params.phoneNumber
    try{
        const Customer = await customer.findOne({Phone_Number})
        console.log(Customer)
        const Customer_Id_Card = Customer.Customer_Id_Card
        const Payments = await payment.find({Customer_Id_Card:Customer_Id_Card})
        if(Payments)
        {
            res.json(Payments)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error!"})
    }
})
module.exports = router
