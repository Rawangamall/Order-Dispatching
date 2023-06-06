const mongoose=require("mongoose");
require("./../Models/LocationModel");

const governateSchema=mongoose.model("Governate");
const citySchema=mongoose.model("City");
const areaSchema=mongoose.model("Area");