const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transSchema = new Schema({
    Trans_Id:{
        type: Number,
        unique: true,
        required:true
    },
    User_Id:{
        type: String,
        required: true
    },
    Room_Num:{
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
        default:Date.now()
    },
    Payment_Id:
    {
        type:String,
        required:true,
        default:null
    },
    Status:{
        type:String,
        default:"uncheck-in"
    },
    Last_Update_Id:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('trans',transSchema)