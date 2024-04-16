const mongoose=require('mongoose'); 
const { create } = require('./user');

const otpschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,

    },
    expiresAt:{
        type:Date,

    }
})

module.exports=mongoose.model('otp',otpschema);
