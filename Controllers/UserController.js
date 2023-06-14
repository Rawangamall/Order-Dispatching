const mongoose=require("mongoose");
require("./../Models/UserModel");
require("./../Models/RoleModel");

const UserSchema=mongoose.model("user");
const RoleSchema=mongoose.model("role");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)


exports.getAll = (request, response, next) => {
  const searchKey = request.body.searchKey?.toLowerCase() || "";
  const role = request.body.role || "";
  const active = request.body.active;

  const query = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchKey, $options: "i" } },
          { lastName: { $regex: searchKey, $options: "i" } },
          { email: { $regex: searchKey, $options: "i" } },
        ],
      },
    ],
  };

  if (typeof active === "boolean") {
    query.$and.push({ active: active });
  }

  if (role) {
    query.$and.push({ Role: role });
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

    // Check if the role already exists
    const existingRole = await RoleSchema.findById(request.body.role_id);
    if (!existingRole) {
      return response.status(400).json({ error: 'Role does not exist' });
    }

    const user = new UserSchema({
      _id: request.body._id,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hash,
      phoneNumber: request.body.phoneNumber,
      role_id: request.body.role_id,
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
