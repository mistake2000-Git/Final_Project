const express = require('express')
const router = express.Router();
const argon2 = require('argon2')
const user = require('../model/user')
const jwt = require('jsonwebtoken')
require('dotenv').config() 

router.get('/',(req,res)=>{
    res.send('hellowr')
})
/*Initial admin
const createadmin = async ()=>{
        const adpassword = "password"
        const adminpassword = await argon2.hash(adpassword)
        const useradmin = new user({
        id:"AD_01",
        Type:"Admin",
        Name:"Tan Loc",
        Phone:"0344254080",
        Email:"tanloc1611@gmail.com",
        Account:"admin",
        Password:adminpassword
    })
    useradmin.save()
}
createadmin()*/

router.post('/login',async (req,res)=>{
    const {Account,Password}= req.body
    
    if(!Account||!Password)
    {
        return res.status(400).json({success:false,message:"Missing user name or password"})
    }
    try
    {
        const User = await user.findOne({Account})
        if(!User)
        {
            return res.status(400).json({success:false,message:'Incorrect user name or password'})
        }
        const passwordValid = await argon2.verify(User.Password,Password)
        if(!passwordValid)
        {
            return res.status(400).json({success:false,message:'Incorrect user name or password'})
        }
        const accessToken = jwt.sign({id:User._id,},process.env.ACCESS_TOKEN_SECRET)
        res.json(
            {
                success:true,
                message:'User login successfully',
                accessToken,
                UserType:User.Type
            }
        )
    }
    catch(error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports= router