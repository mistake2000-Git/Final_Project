const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    userID:{
        type: String,
        unique: true,
        required:true
    },
    Type:{
        type: String,
        required: true
    },
    Name:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        unique:true,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Account:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required: true
    }
})
module.exports = mongoose.model('user',userSchema)