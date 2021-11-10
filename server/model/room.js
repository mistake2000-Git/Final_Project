const mongoose = require('mongoose');
const Schema = mongoose.Schema

const roomSchema = new Schema({
    Room_Id:{
        type: String,
        unique: true,
        required:true
    },
    Room_Num:{
        type: Number,
        required: true
    },
    Room_Name:{
        type:String,
        required:true
    },
    Price_per_Hour:{
        type:Number,
        required: true
    },
    Price_per_Night:{
        type:Number,
        required:true,
    },
    Price_per_Day:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        required:true,
        default:"unbooked"
    },
    Create_By:{
        type:String,
        required:true
    }

   
})
module.exports = mongoose.model('rooms',roomSchema)