const mongoose = require('mongoose');
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    Payment_Id:{
        type: String,
        unique: true,
        required:true
    },
    User_Id:
    {
        type: String,
        required: true
    },
    Payment_method:
    {
        type:String,
        required:true
    },
    Payment_Status:{
        type:String,
        required:true
    },
    Total:{
        type:Number,
        required:true
    },
    Create_Date:{
        type:Date,
        required: true
    },
    Create_By:{
        type:String,
        required:true
    } 
})
module.exports = mongoose.model('payment',paymentSchema)