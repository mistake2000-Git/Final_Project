const mongoose = require('mongoose');
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    Payment_Id:{
        type: String,
        unique: true,
        required:true
    },
    Customer_Id:
    {
        type: String,
        required: true
    },
    Payment_method:
    {
        type:String,
        default:"Cash",
        required:true
    },
    Payment_Status:{
        type:String,
        default:"Unpaid",
        required:true
    },
    Total:{
        type:Number,
        default:0,
        required:true
    },
    Create_Date:{
        type:Date,
        default:Date.now(),
        required: true
    },
    Create_By:{
        type:String,
        required:true
    } 
})
module.exports = mongoose.model('payment',paymentSchema)