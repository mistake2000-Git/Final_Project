const express = require('express')
const router = express.Router();
const user = require('../model/user')
const autoId = require('../middleware/autoId');
const verifyTokenEmp = require('../middleware/auth')
const customer  = require('../model/customer')
const trans = require('../model/transaction')
const payment = require('../model/payment')

//Get all customer
router.get('/',async function getCustomers (req,res)
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
router.get('/getone/:phoneNumber',async function getOneCustomer (req,res)
{
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
router.get('/getCustomerTrans/:phoneNumber',async function getCustomerTransaction(req,res)
{
    const Phone_Number = req.params.phoneNumber
    try
    {
        const transList = await trans.find({Phone_Number})
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
            res.json(transList)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Internal Error!"})
    }
})

//Get payment of customer
router.get('/getCustomerPays/:phoneNumber',async function getCustomerPayment(req,res)
{
    const Phone_Number = req.params.phoneNumber
    try{
        const Customer = await customer.findOne({Phone_Number})
        const Customer_Id_Card = Customer.Customer_Id_Card
        const Payments = await payment.find({Customer_Id_Card:Customer_Id_Card})
        if(Payments)
        {
            for(let i = 0;i<Payments.length;i++)
            {
                Payments[i] = JSON.stringify(Payments[i])
                Payments[i] = JSON.parse(Payments[i])
                Payments[i].Create_Date_Formatted = new Date(Payments[i].Create_Date).toLocaleString()
            }
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
