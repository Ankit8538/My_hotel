const mongoose = require ('mongoose');
const modalaSch=require("../models/Listing.js");
const factdata=require("./data.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Hotel');
  }

  main().then((res)=>
{
   console.log("connected to the database");
})
  .catch(err => console.log(err));

  const initDb=async()=>
  {
    await modalaSch.deleteMany({})
    factdata.data=factdata.data.map((obj)=>({...obj,owner:"6700c89f9bac11188e389773"}))
    let allover=await modalaSch.insertMany(factdata.data);
    console.log(allover);
  }
  initDb()