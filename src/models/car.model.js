const mongoose = require("mongoose");

const CarRegSchema = new mongoose.Schema({
  category: {
    type: String
    
  },
  color: {
    type: String,
  },
  model: {
    type: Number
  },
  make: {
    type: String
  },
  registration_no: {
    type: String
  }
});

//now define a model
const Car = new mongoose.model("Car", CarRegSchema);
module.exports = Car;
