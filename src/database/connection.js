const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/CarshowRoom").then(()=>{
    console.log("connection sucessfull Database ");
}).catch((err)=>{
    console.log("not connected with Database",err);
})