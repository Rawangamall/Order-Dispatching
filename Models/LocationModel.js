const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const areaSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true
  }
});

const citySchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true
  },
  areas: [areaSchema]
});

const governateSchema = new mongoose.Schema({
  _id: Number,
  governate: {
    type: String,
    required: true
  },
  cities: [citySchema]
});

areaSchema.plugin(AutoIncrement,{id:'area_id',inc_field:"_id"});
citySchema.plugin(AutoIncrement,{id:'city_id',inc_field:"_id"});
governateSchema.plugin(AutoIncrement,{id:'gov_id',inc_field:"_id"});

const Governate = mongoose.model('Governate', governateSchema);

module.exports = Governate;
