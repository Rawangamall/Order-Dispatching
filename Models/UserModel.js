const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

//create schema object
const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
  };

const schema=new mongoose.Schema({
    _id : Number,
    firstName:String,
    lastName:String,
    email:{type: String,required:true,validate:[validateEmail,"invalid email"],unique:true},
    password:{type:String , select:false} ,
    image:String ,
    Role:String ,
    phoneNumber:Number 
   
},
);

schema.methods.correctPassword = async function(candidatePassword , userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
}

schema.plugin(AutoIncrement,{id:'user_id',inc_field:"_id"});

//mapping
mongoose.model("user",schema);