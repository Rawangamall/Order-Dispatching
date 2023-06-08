const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

//create schema object

const governateSchema=new mongoose.Schema({
    _id : Number,
    governateName:{
      type: String,
      required: true
    },
    governateCode:{
      type: Number,
      required: true
    },
},
);


const citySchema=new mongoose.Schema({
  _id : Number,
  cityName:{
    type: String,
    required: true
  },
  cityCode:{
    type: Number,
    required: true
  },
  cityParent:[{
    type: String,
    ref: 'Governate',
    required: true
  }],
},
);


const areaSchema=new mongoose.Schema({
  _id : Number,
  areaName: {
    type: String,
    required: true
  },
  areaCode: {
    type: Number,
    required: true
  },
  areaParent:[{
    type: String,
    ref: 'City',
    required: true
  }],},
);

const LocationSchema=new mongoose.Schema({
  _id : Number,
  governateId: [{
    type: Number,
    ref: 'Governate',
    required: true
  }],
  cityId: [{
    type: Number,
    ref: 'City',
    required: true
  }],
  areaId:[{
    type: Number,
    ref: 'Area',
    required: true
  }],},
);


governateSchema.plugin(AutoIncrement,{id:'governate_id',inc_field:"_id"});
citySchema.plugin(AutoIncrement,{id:'city_id',inc_field:"_id"});
areaSchema.plugin(AutoIncrement,{id:'area_id',inc_field:"_id"});
LocationSchema.plugin(AutoIncrement,{id:'location_id',inc_field:"_id"});

//mapping
const Governate = mongoose.model("Governate",governateSchema);
const City = mongoose.model("City",citySchema);
const Area =mongoose.model("Area",areaSchema);
const Location =mongoose.model("Location",LocationSchema);

module.exports = {
  Governate,
  City,
  Area,
  Location
};