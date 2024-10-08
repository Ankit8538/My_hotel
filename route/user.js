const express = require('express');
const app = express();
const router=express.Router();
const User=require("../models/user.js");
const wrapAsyns = require('../utils/wrapAsyn');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.get("/signup",async(req,res)=>
{
    let signupdata= await User.find();
      console.log("sucessfully");
      if(!signupdata)
      {
        req.flash("error","this data not exits !");
          res.redirect("/listings");
      }
      console.log(signupdata);
    res.render("users/signup.ejs");
})
router.post("/signup",upload.single('image'),wrapAsyns(async(req,res)=>
{
    try
    {
    
        let url=req.file.path;
     let filename=req.file.filename;
     console.log(url,"..",filename);
    let {name,gender,age,email,phone,username,image,password}=req.body;
    let userdata= new User({
        name:name,
        gender:gender,
        age:age,
        email:email,
        mobile_num:phone,
        username:username,
        image:{url,filename},
    })
    let registerUser=await User.register(userdata,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>
    {
        if(err)
        {
            return next(err)
        }
        req.flash("status","your data sucessfully sumbit my website");
        res.redirect("/listings");
    })
    
}catch(err)
{
    req.flash("error",err.message);
    res.redirect("/signup");
}
}))

router.get("/login",saveRedirectUrl,(req,res)=>
{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>
{
    req.flash("status","you are sucessfully login my website");
    res.redirect("/listings");
})

router.get("/profile",async(req,res)=>
{
    let imodata=req.user._id;
    console.log(imodata);
    let alldataUser= await User.findById(imodata)
      console.log("sucessfully");
      if(!alldataUser)
      {
        req.flash("error","this data not exits !");
          res.redirect("/listings");
      }
     
    res.render("users/profileUser.ejs",{alldataUser});
})

router.get("/logout",(req,res,next)=>
{
    req.logOut((err)=>
    {
        if(err)
        {
           return next(err)
        }
        req.flash("status","you are sucessfully log out")
        res.redirect("/listings");
    })
})
module.exports=router;