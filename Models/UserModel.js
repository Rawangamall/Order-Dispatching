const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//create schema object
const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return regex.test(email);
};

const schema = new mongoose.Schema({
  _id: Number,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "invalid email"],
    unique: true,
  },
  password: { type: String, select: false },
  image:{ type : String , default:"default.jpg"},
  role_id: { type: Number, ref: "role", required: true },
  phoneNumber: {type:String, unique:true},
 active: {
    type: Boolean,
    default: true,
  },
   
  code: String,
  passwordResetExpires: Date,
}
,{ timestamps: true});

schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.createPasswordRandomToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.code = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min

  return resetToken;
};

schema.plugin(AutoIncrement, { id: "user_id", inc_field: "_id" });

//mapping
mongoose.model("user", schema);
