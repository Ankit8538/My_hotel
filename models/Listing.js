const { ref } = require('joi');
const mongoose = require('mongoose');
const Review=require('./review.js');
const { listingSchema } = require('../sechema.js');

const hotelSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    image:{
       url:String,
       filename:String,

    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:
    {
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    }
})


hotelSchema.post("fineOneandDelete",async(listing)=>
{
    if(listing)
    {
    await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

let allRow= mongoose.model('allRow',hotelSchema);

module.exports=allRow;