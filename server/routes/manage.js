const express = require('express')
const router = express.Router();
const user = require('../model/user')
const argon2 = require('argon2')
const verifyToken = require('../middleware/authadmin')
router.get('/',async (req,res)=>{
    await user.updateOne({userID:"EMP_02"},{Phone:"akjsdhflaksjdas"})
    res.json({success:true,message:"Create user successfully"})
})
//Create new user 
router.post('/',verifyToken,async (req,res)=>{
    const {userID,Type,Name,Phone,Email,Account,Password} = req.body
    try
    {
        const checkAccount = await user.findOne({Account})
        if(checkAccount)
        {
            return res.status(400).json({success:false,message:"The user account already exist"})
        }

        const passwordHash = await argon2.hash(req.body.Password)
        const User = new user({userID,Type,Name,Phone,Email,Account,Password:passwordHash})
        await User.save()
        res.json({success:true,message:"Create user successfully",User: User})
    }
    catch(error)
    {
        res.json({success:false,message:"User Name or ID is already exist"})
    }
})
//delete user
router.delete('/', async(req,res)=>{
    const {userID} = req.body
    try{
        await user.findOneAndDelete({userID})
        res.json({success:true,message:"User has been deleted"})
    }
    catch(err)
    {
        res.status(400).json({success:false,message:"Can not find the user to delete"})
    }
})

//update user infomation
router.patch('/', async(req,res)=>{
    const {userID} = req.body
    try 
    {
        const User = await user.findOne({userID})
        if(!User)
        {
            return res.status(400).json({success:false,message:"Can not find the user to update"})
        }
        const userProperty = Object.keys(req.body)
        const userValues = Object.values(req.body)
        for(let i=1;i<userProperty.length;i++)
        {
            let property = userProperty[i]
            let values = userValues[i]
            let filter = {userID}
            let update = {property:values}
            update[property] = update['property']
            await user.updateOne(filter,update)
        }
        res.json({success:true,message:"Update user infomation successfully"})
    }
    catch(err)
    {
        res.json({message:false,message:"Can not find the user or userID input is empty!"})
    }
})

module.exports= router