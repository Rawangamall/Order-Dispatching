const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

//create schema object

const governateSchema=new mongoose.Schema({
    _id : Number,
    governate:{
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
  city:{
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
  area: {
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


// governateSchema.plugin(AutoIncrement,{id:'user_id',inc_field:"_id"});
// citySchema.plugin(AutoIncrement,{id:'user_id',inc_field:"_id"});
// areaSchema.plugin(AutoIncrement,{id:'user_id',inc_field:"_id"});

//mapping
const Governate = mongoose.model("Governate",governateSchema);
const City = mongoose.model("City",citySchema);
const Area =mongoose.model("Area",areaSchema);

module.exports = {
  Governate,
  City,
  Area
};