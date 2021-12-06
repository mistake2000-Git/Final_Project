const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{type: String,unique: true,required:true},
    Img:{type:String},
    Type:{type: String,required: true},
    Name:{type:String,required:true},
    Phone:{type:String,unique:true,required: true},
    Gender:{type:String,required:true},
    Email:{type: String,required: true},
    Date_of_Birth:{type:String,required:true},
    Address:{type:String,required:true},
    Account:{type:String,unique:true,required:true},
    Password:{type:String,required: true}
})
module.exports = mongoose.model('user',userSchema)