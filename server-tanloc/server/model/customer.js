const mongoose = require('mongoose');
const Schema = mongoose.Schema

const customerSchema = new Schema({
    Customer_Id:{
        type: String,
        unique: true,
        required:true
    },
    Customer_Name:{
        type: String,
        required: true
    },
    Phone:{
        type:String,
        unique:true,
    },
    Customer_ID_Card:{
        type:Number,
        unique:true
    },
    Email:{
        type: String,
    }
})
module.exports = mongoose.model('customer',customerSchema)