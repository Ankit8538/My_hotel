const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema= new Schema({
    name:{
        type:String,
        required:true
       },
    gender:
        {
        type:String,
        required:true
       },
       age:
       {
        type:Number,
        required:true
       },
    email:
       {
        type:String,
        required:true
       },
    mobile_num:
    {
        type:Number,
        required:true
    },
    image:
    {
        url:String,
       filename:String,

    }

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);