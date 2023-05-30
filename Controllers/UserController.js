const mongoose=require("mongoose");
require("./../Models/UserModel");

const UserSchema=mongoose.model("user");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)

exports.getAll=(request,response)=>{
   
    UserSchema.find({})
                    .then((data)=>{
                        response.status(200).json(data);
                    })
                    .catch(error=>{
                        next(error);
                    })
}
  
exports.addUser=(request,response,next)=>{
    let user=new UserSchema(request.body);
    user.password=bcrypt.hashSync(member.password, salt);
    user.save()
            .then((data)=>{
                response.status(201).json(data);
            })
            .catch(error=>{
                next(error);
            })
}

