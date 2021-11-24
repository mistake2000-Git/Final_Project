const mongoose = require('mongoose');
const Schema = mongoose.Schema
require('mongoose-moment')(mongoose);
const transSchema = new Schema({
    Trans_Id:{
        type: String,
        unique: true,
        required:true
    },
    Customer_Id:{
        type: String,
        required: true
    },
    Room_Num:{
        type:String,
        required:true
    },
    Start_Date:{
        type:Date,
        default: Date.now()
    },
    End_Date:{
        type:Date,
        required:true
    },
    Create_Date:{
        type:Date, 
        default: Date.now()  
    },
    Payment_Id:
    {
        type:String,
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