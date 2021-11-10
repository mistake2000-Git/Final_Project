const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    userID:{
        type: Number,
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
        required: true
    },
    Email:{
        type: mongoose.SchemaType.Email,
        required: true
    }
})
module.exports = mongoose.model('user',userSchema)