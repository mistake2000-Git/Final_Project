const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transSchema = new Schema({
    Trans_Id:{
        type: Number,
        unique: true,
        required:true
    },
    User_Id:{
        type: Number,
        required: true
    },
    Room_Name:{
        type:String,
        required:true
    },
    Star_Date:{
        type:Date,
        default: Date.now()
    },
    End_Date:{
        type:Date,
        required:true
    },
    Create_Date:{
        type:Date,
        default:Data.now()
    },
    Payment_Method:
    {
        type:String,
        default:"Cash"
    },
    Total:{
        type:Number,
        required:True
    },
    Status:{
        type:String,
        default:"unpaid"
    },
    Last_Update_Id:{
        type:Number,
        required:true
    }
    
   
})
module.exports = mongoose.model('trans',userSchema)