const mongoose = require('mongoose');
const Schema = mongoose.Schema

const customerSchema = new Schema({
   id:{
        type:String,
        unique:true,
        required:true
   },
   Customer_Name:
   {
       type:String,
       required:true
   },
   Customer_Id_Card:
   {
        type:String,
        unique:true,
        required:true
   },
   Phone_Number:
   {
        type:String,
        unique:true,
        required:true
   }
})
module.exports = mongoose.model('customer',customerSchema)