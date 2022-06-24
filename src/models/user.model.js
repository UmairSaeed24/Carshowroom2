const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")

const UserRegSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  tokens:{
    type:String
  }
});









//now define a model
const User = new mongoose.model("User", UserRegSchema);
module.exports = User;
