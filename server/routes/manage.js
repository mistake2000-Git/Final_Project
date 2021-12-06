const express = require('express')
const router = express.Router();
const user = require('../model/user')
const argon2 = require('argon2')
const verifyToken = require('../middleware/authadmin');
const autoId = require('../middleware/autoId');
const verifyTokenEmp = require('../middleware/auth')
//Get profile
router.get('/getprofile',verifyTokenEmp,async(req,res)=>{
    try{
        const User = await user.findOne({_id:req._id})
        if(User)
        {
            res.json(User)
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Internal Error!"})
    }
})
//Get one user
router.get('/getone/:id',verifyToken,async(req,res)=>{
    const id = req.params.id
    try{
        const User = await user.findOne({id},{Password:0})
        if(User)
            return res.json(User)
        else
            throw new Error()
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Can not find user or internal error!"})
    }
})
//Get all user
router.get('/',verifyToken,async (req,res)=>{
    try
    {
        const User = await user.find()
        res.json(User)
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({success:false,message:"Internal Error"})
    }
})
//Create new user 
router.post('/',verifyToken,async (req,res)=>{
    const {id,Type,Img,Name,Phone,Gender,Date_of_Birth,Address,Email,Account,Password} = req.body
    try
    {
        const checkAccount = await user.findOne({Account})
        if(checkAccount)
        {
            return res.status(400).json({success:false,message:"The user account already exist"})
        }

        const passwordHash = await argon2.hash(req.body.Password)
        let newId =  await autoId(Type)
        const User = new user({id:newId,Type,Img,Name,Gender,Date_of_Birth,Address,Phone,Email,Account,Password:passwordHash})
        await User.save()
        res.json({success:true,message:"Create user successfully",User: User})
    }
    catch(error)
    {
        console.log(error.message)
        res.json({success:false,message:"Account or phone number is exist!"})
    }
})
//delete user
router.delete('/:id',verifyToken, async(req,res)=>{
    const id = req.params.id
    try{
        await user.findOneAndDelete({id:id})
        res.json({success:true,message:"User has been deleted"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Can not find the user to delete"})
    }
})

//update user infomation
router.patch('/',verifyTokenEmp, async(req,res)=>{
    const {id} = req.body
    try 
    {
        const User = await user.findOne({id})
        if(!User)
        {
            return res.status(400).json({success:false,message:"Can not find the user to update"})
        }
        const userProperty = Object.keys(req.body)
        const userValues = Object.values(req.body)
        for(let i=1;i<userProperty.length;i++)
        {
            if(userValues[i]!="")
            {   
                let property = userProperty[i]
                let values = userValues[i]
                let filter = {id}
                let update = {property:values}
                update[property] = update['property']
                await user.updateOne(filter,update)
            }
        }
        res.json({success:true,message:"Update user infomation successfully"})
    }
    catch(err)
    {
        res.status(404).json({message:false,message:"Can not find the user or id input is empty!"})
    }
})

module.exports= router