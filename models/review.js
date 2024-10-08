const { types } = require('joi');
const mongoose = require ('mongoose');

const reviewSchema= new mongoose.Schema({
    Comment:String,
    rating:
    {
        type:Number,
        min:1,
        max:5
    },
    createdAt:
    {
        type:Date,
        default:Date.now()
    },
    author:
    {
        
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    }
})

let Review= mongoose.model("Review",reviewSchema);

module.exports=Review;