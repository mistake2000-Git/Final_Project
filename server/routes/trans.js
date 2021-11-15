const express =  require('express')
const router = express.Router()
const room = require('../model/room')
const user = require('../model/user')
const trans = require('../model/transaction')
const payment = require('../model/payment')
const verifyToken = require('../middleware/auth')

/*async function autoId(name)
{
    if(name='PAY')
    {
        await payment.findOne().sort(, 1).run( function(err, doc) {
            var max = doc.last_mod;
       });
    }
}*/
//user booking
router.post('/',verifyToken,async (req,res)=>{
    const {User_Id,Room_Num,Start_Date,End_Date}=req.body
    console.log(User_Id)
    try
    {
        //const checkRoom = await room.findOne({Room_Num})
        /*if (!checkRoom||checkRoom.status==="booked")
        {
                return res.status(400).json({success:false,message:"The room number is wrong or room was booked! "})
        }*/
        if (!window.User_Id)
        {
            const userId = req._id
            console.log(userId)
            const findUser= await user.findOne({userId})
            const newTrans = new trans ({User_Id:findUser.userId,Room_Num,Start_Date,End_Date,Last_Update_Id:findUser.User_Id})
            await newTrans.save()
        }
        /*else if(User_Id)
        {
            const newTrans = new trans ({User_Id,Room_Num,Start_Date,End_Date,Last_Update_Id:req.body.User_Id})
            await newTrans.save()
        }
        res.json({success:true,message:"Create transaction successfully!"})*/
    }
    catch(err)
    {
        res.json({success:false,message:"Internal error"})
    }
})
module.exports = router