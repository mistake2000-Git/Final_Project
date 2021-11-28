const jwt = require('jsonwebtoken')
const { findOne } = require('../model/user')
require('dotenv').config()
const user = require('../model/user')
const verifyToken = async (req,res,next)=>{
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if(!token)
    {
        return res.status(401).json({success:false,message:"Token Not Found"})
    }
    try
    {
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const adminCheck = await user.findOne({_id:decode.id})
        if(adminCheck.Type !== "Admin")
        {
            return res.json({success:false,message:"You are not allow to access"})
        }
        req._id = decode.id
        next()
    }
    catch(error)
    {
        console.log(error)
        return res.status(403).json({success:false,message:"Invalid token"})
    }
}

module.exports = verifyToken