const mongoose = require('mongoose');
const Schema = mongoose.Schema
require('mongoose-moment')(mongoose);
const transSchema = new Schema({
    id:{type: String,unique: true,required:true},
    Customer_Name:{type:String,required:true},
    Customer_Id_Card:{type:Number,require:true},
    Phone_Number:{type:String},
    Room_Num:{type:String,required:true},
    Start_Date:{type:Date,default: Date.now()},
    End_Date:{type:Date,required:true},
    Create_Date:{type:Date, default: Date.now()},
    Payment_Id:
    {type:String,default:null},
    Payment_Method:{type:String,default:"Cash",require:true},
    Status:{type:String,default:"Uncheck-in"},
    Status_Payment:{type:String,default:"Unpaid",required:true},
    Total:{type:Number,default:0,required:true}
})
module.exports = mongoose.model('trans',transSchema)