const mongoose=require("mongoose");
require("./../Models/UserModel");

const UserSchema=mongoose.model("user");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)


exports.getAll = (request, response, next) => {
  const searchKey = request.body.searchKey?.toLowerCase()|| "";
 

  const query = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchKey, $options: "i" } },
          { lastName: { $regex: searchKey, $options: "i" } },
          { email: { $regex: searchKey, $options: "i" } },
        ],
      },
      { role: role },
  
    ],
  };

  if (typeof active === "boolean") {
    console.log(active);
    query.$and.push({ active: active });
  }

  UserSchema.find(query)
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};




      exports.addUser = async (request, response, next) => {
        try {
          const hash = await bcrypt.hash(request.body.password, salt);
          const user = new UserSchema({
            _id: request.body._id,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hash,
            phoneNumber: request.body.phoneNumber,
            Role: request.body.Role,
            active: request.body.active
          });
          const data = await user.save();
          response.status(201).json(data);
        } catch (error) {
          next(error);
        }
      };
      
exports.getUserById=(request,response,next)=>{
    UserSchema.findById(request.params.id)
                    .then((data)=>{
                        response.status(200).json(data);
                    })
                    .catch(error=>{
                        next(error);
                    })
}

exports.updateUser = (request, response, next) => {
    const strpass = request.body.password;
    let hash;
    if (strpass && strpass.length > 8) {
      hash = bcrypt.hashSync(request.body.password, salt);
    }
    UserSchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          email: request.body.email,
          phoneNumber: request.body.phoneNumber,
          Role: request.body.Role,
          password: hash,
          image: request.body.image,
          active: request.body.active
        }
      }
    )
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  };
  

exports.deleteUser=(request,response,next)=>{
    UserSchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}

exports.filterUser=(request,response,next)=>{
    UserSchema.find({

        Role:request.params.Role,
        active:request.params.active
 
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}

exports.searchUser=(request,response,next)=>{
    UserSchema.find({
        firstName:request.params.firstName
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}

// exports.searchUser=(request,response,next)=>{
   
//             //Search for Books
//             const searchKey = request.body.searchKey?.toLowerCase();
//             const firstName = request.body.firstName?.toLowerCase();
//             const lastName = request.body.lastName?.toLowerCase();
//             const phoneNumber = request.body.phoneNumber?.toLowerCase();
//             const email = request.body.email?.toLowerCase();

//             if(firstName==""){firstName=searchKey;}
//             if(lastName==""){lastName=searchKey;}
//             if(phoneNumber==""){phoneNumber=searchKey;}
//             if(email==""){email=searchKey;}

//             UserSchema.find({
//                 $or: [
//                   { firstName: firstName },
//                   { lastName: lastName },
//                   { phoneNumber: phoneNumber },
//                   { email: email }
                 
//                 ],
//                 'noOfCopies': { $gt: 1 }
//               },{title:1,publisher:1,author:1,available:1,noBorrowed:1,noOfCurrentBorrowed:1,noOfCopies:1,availableCopies: { $subtract: ['$noOfCopies', '$noOfCurrentBorrowed'] } }
//               )
//               .then(data=>{
//                     if(data=="")
//                     {
//                         next(new Error("This Book is not found, Invalid Input"));
//                     }
//                     else{
//                         response.status(200).json({data})
//                     }
//                 })
//                 .catch(error=>{next(error);
//                 })}
//                 else{response.status(404).json({result:"Please update your profile data!! and login again"});}
//          }

