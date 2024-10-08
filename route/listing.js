const express = require('express');
const app = express();
const router=express.Router({mergeParams:true});
let wrapAsyns=require("../utils/wrapAsyn.js");
let ExpressError=require("../utils/ExpressErr.js");
let {listingSchema,reviewSchema}=require("../sechema.js");
let ori=require("../models/Listing.js");
const User=require("../models/user.js");

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });




const validateListings=(req,res,next)=>
    {
      let {error}=listingSchema.validate(req.body);
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
    
    


router.get("/",wrapAsyns(async(req,res)=>
    {
      let alldata= await ori.find();
      console.log("sucessfully");
      if(!alldata)
      {
        req.flash("error","this data not exits !");
          res.redirect("/listings");
      }
      res.render("listings/index.ejs",{alldata})
    }))
    // create new listings
    router.get("/new",(req,res)=>
      {
        console.log(req.user);
        if(!req.isAuthenticated())
        {
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
        res.render("listings/new.ejs");
      })
    // show the personal data
    router.get("/:id",wrapAsyns(async(req,res)=>
    {
       let {id}=req.params;
        console.log(id);
       let specal=await ori.findById(id).populate("reviews").populate("owner");
       if(!specal)
       {
        req.flash("error","your data not exist!");
        req.redirect("/listings");
       }
       console.log(specal);
       res.render("listings/show.ejs",{specal});
    }))

    // new listings insert database
router.post("/",upload.single('image'),wrapAsyns(async(req,res,next)=>
    {
      if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
     let result= listingSchema.validate(req.body);
     console.log(result);
     let url=req.file.path;
     let filename=req.file.filename;
     console.log(url,"..",filename);
      let {title,description,image,price,location,country}=req.body
      let insertdata=new ori({
        title:title,
        description:description,
        image:{url,filename},
        price:price,
        location:location,
        country:country
      })
      console.log(req.user);
      insertdata.owner=req.user._id;
      let newdata= await insertdata.save();
      console.log(newdata);
      req.flash("status","wow your data is created!");
      res.redirect("/listings");
    })
  );

    //edit route personal data
    router.get("/:id/edit",wrapAsyns(async(req,res)=>
    {
      if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
      let {id}= req.params;
      fetchori =await ori.findById(id)
      if(!fetchori.owner._id.equals(req.user._id))
      {
            req.flash("error","Sorry daer you do not have permission to Edit");
           return res.redirect(`/listings/${id}`);
      }
      let editacc=await ori.findById(id);
      res.render("listings/edit.ejs",{editacc});
    }))
    //route put request final update data
  
    router.put("/:id/update",upload.single('image'),wrapAsyns(async(req,res)=>
    {
      if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","sorry you must be login create new listing !");
          return res.redirect("/login");
        }
      let {id}=req.params;
      
     
      let {title,description,image,price,location,country}=req.body

          fetchori =await ori.findById(id)
          if(!fetchori.owner._id.equals(req.user._id))
          {
                req.flash("error","Sorry daer you do not have permission to Edit");
               return res.redirect(`/listings/${id}`);
          }
        

      let ups=await ori.findByIdAndUpdate(id,
        {
         title:title,
         description:description,
         image:image,
         price:price,
         location:location,
         country:country
        },
        {
          new:true
        }
      )

      if(typeof req.file !== "undefined")
      {
      let url=req.file.path;
      let filename=req.file.filename;
     ups.image={url,filename};
     await ups.save();
      }
      req.flash("status","your data sucessfully update!");
      console.log(ups);
      res.redirect(`/listings/${id}`);
     }))
    //delete this listings data route
  
   router.delete("/:id",wrapAsyns(async(req,res)=>
  {
   
    if(!req.isAuthenticated())
      {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","sorry you must be login create new listing !");
        return res.redirect("/login");
      }
    let {id}=req.params;
    fetchori =await ori.findById(id)
    if(!fetchori.owner._id.equals(req.user._id))
    {
          req.flash("error","Sorry daer you do not have permission to Delete");
         return res.redirect(`/listings/${id}`);
    }
    let deledat=await ori.findByIdAndDelete(id);
    req.flash("status","Sorry dear your data is not delete!");
    console.log(deledat);
    res.redirect("/listings");
  }))

  module.exports=router