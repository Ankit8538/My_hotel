const express = require('express');
const app = express();
const router=express.Router({mergeParams:true});
let wrapAsyns=require("../utils/wrapAsyn.js");
let ExpressError=require("../utils/ExpressErr.js");
let {reviewSchema}=require("../sechema.js");
let Review=require("../models/review.js");
let ori=require("../models/Listing.js");

const validateReview=(req,res,next)=>
    {
      let {error}=reviewSchema.validate(req.body);
      if(error)
      {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressErr(400,errMsg);
      }
      else
      {
        next();
      }
    }

 
// Review route create
router.post("/",wrapAsyns(async(req,res)=>
    {
      if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
        let accid=await ori.findById(req.params.id);
        let newReview= new Review(req.body.review);
        accid.reviews.push(newReview);
        await newReview.save();
        await accid.save();
        req.flash("status","your feedback created !");
        res.redirect(`/listings/${accid._id}`);
    }))
      //delete review route
    router.delete("/:idreview",wrapAsyns(async(req,res)=>
    {
      if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
           let {id,idreview}=req.params;
           await ori.findByIdAndUpdate(id,{$pull:{reviews:idreview}})
           await Review.findByIdAndDelete(idreview);
           req.flash("status","your feedback delete!");
           res.redirect(`/listings/${id}`)
    }));

    module.exports=router;