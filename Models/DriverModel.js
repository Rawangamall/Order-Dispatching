const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
// const location = require("./LocationModel");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//create schema object
const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
  };

const schema=new mongoose.Schema({
    _id : Number,
    // driverCode: Number ,
    driverName:String,
    status: {type: String,
    enum: {
        values:[
        "active",
        "not active"
      ]},
      default: "active"
    },
    availability: {type: String,
      enum: {
        values: [
        "free",
        "busy"
      ]
    },
    default: "free"
    },
    email:{type: String,validate:[validateEmail,"invalid email"]},
    phoneNumber: String ,
    areas : [{
        type: Number,
        ref : 'area',
    }],
    orderCount: {
      type: Number,
      default: 0
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  });
  


schema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword)
  }
  
  schema.methods.createPasswordRandomToken = async function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000     //10 min  
  return resetToken;
  };


schema.plugin(AutoIncrement,{id:'driver_id',inc_field:"_id"});

//mapping
mongoose.model("driver",schema);