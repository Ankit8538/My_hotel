if(process.env.NODE_ENV != "production")
{
  require('dotenv').config();
}



const express = require('express');
const app = express();
let port=6060;
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path=require("path");
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.use(express.json());
let ori=require("./models/Listing.js");
let Review=require("./models/review.js");
const { title } = require('process');
//mongoLink='mongodb://127.0.0.1:27017/Hotel';
dbsUrl=process.env.ATLASDB_URL;
main().then((res)=>
  {
     console.log("connected databse");
  })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbsUrl);
  }

  

  let wrapAsyns=require("./utils/wrapAsyn.js");
  let ExpressError=require("./utils/ExpressErr.js");
  let {listingSchema,reviewSchema}=require("./sechema.js");
const { access } = require('fs');
const ExpressErr = require('./utils/ExpressErr.js');
const listingsRouter=require("./route/listing.js");
const reviewRouter=require("./route/review.js");
const userRouter=require("./route/user.js");

const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const store=MongoStore.create({
  //mongoLink
  mongoUrl:dbsUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:23*3600,
});

store.on("error",()=>
{
  console.log("EEOR IN mongo session",error);
});

  let sessionmiddle={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:
           {
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true
           },
    }

    

    app.use(session(sessionmiddle));
//app.use(session({secret:"mysupersecret",resave:false,
    //saveUninitialized:true}))
    app.use(flash())//this type of middleware package

    app.use(passport.initialize())
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()))

    passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

  app.use((req,res,next)=>
  {
    res.locals.success=req.flash("status");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
  })
  

  // app.get("/demouser",async(req,res)=>
  // {
  //    let fakedata= new User({
  //     name:"Ankit kumar",
  //     gender:"male",
  //     email:"ankitkumarkumar175@gmail.com",
  //     mobile_num:7667607445,
  //     username:"Ankit8538"
  //    });
  //    let registeruser=await User.register(fakedata,"ankii8538")
  //    res.send(registeruser);
  // })


  app.use("/listings",listingsRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);


app.all("*",(req,res,next)=>
  {
    next(new ExpressError(404,"this page is not found"));
  })


app.use((err,req,res,next)=>
{
  let {statusCode=500,message="something went wrong"}=err
  res.status(statusCode).render("Error.ejs",{message});
 // res.status(statusCode).send(message);
})

app.listen(port,()=>
{
  console.log("this all listings 6060");
})