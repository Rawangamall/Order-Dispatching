const mongoose = require("mongoose");
require("./../Models/UserModel");
require("./../Models/RoleModel");

const UserSchema = mongoose.model("user");
const RoleSchema = mongoose.model("role");

const bcrypt = require("bcrypt");
const CatchAsync = require("../utils/CatchAsync");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

exports.getAll = async (request, response, next) => {
  const searchKey = request.headers.searchkey?.toLowerCase() || "";
  const role = request.headers.role || "";
  const active = request.headers.active;
  const userNum = request.headers.usernum || null;

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

  if (active == "true") query.$and.push({ active: true });
  else if (active == "false") query.$and.push({ active: false });

  if (typeof active === "boolean") {
    query.$and.push({ active: active });
  }

  if (role) {
    const role_id = await RoleSchema.findOne({ name: role });

    query.$and.push({ role_id: role_id._id });
  }

  const limit = parseInt(userNum) || 7;

  const userProjection = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    password: 1,
    roleName: { $ifNull: ["$role.name", "Unknown"] },
    phoneNumber: 1,
    active: 1,
  };

  UserSchema.aggregate([
    { $match: query },
    { $limit: limit },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "roles", // Assuming the collection name for roles is "roles"
        localField: "role_id",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
    {
      $project: userProjection,
    },
  ])
    .then((data) => {
      UserSchema.countDocuments({})
        .then((count) => {
          response.status(200).json({
            count,
            data,
          });
        })
        .catch((error) => {
          next(error);
        });
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
      return response.status(400).json({ error: "Role does not exist" });
    }

    const user = new UserSchema({
      _id: request.body._id,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hash,
      phoneNumber: request.body.phoneNumber,
      role_id: request.body.role_id,
      active: request.body.active,
    });

    const data = await user.save();
    response.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = (request, response, next) => {
  UserSchema.findById(request.params.id)
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateUser = (request, response, next) => {
  console.log(request.image, "in controller");

  const strpass = request.body.password;
  let hash;
  if (strpass && strpass.length > 8) {
    hash = bcrypt.hashSync(request.body.password, salt);
  }

  UserSchema.updateOne(
    {
      _id: request.params.id,
    },
    {
      $set: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        role_id: request.body.role_id,
        password: hash,
        image: request.image,
        active: request.body.active,
      },
    }
  )
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteUser = (request, response, next) => {
  UserSchema.deleteOne({
    _id: request.params.id,
  })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

exports.navUser = CatchAsync(async (request, response, next) => {
  const userID = request.params.id;

  if (userID) {
    const data = await UserSchema.findById(userID);
    const image = data.image;
    const name = data.firstName;
    response.status(200).json({ image, name });
  } else {
    return next(new AppError(`That User is not found`, 404));
  }
});

exports.BanUser = CatchAsync(async (request, response, next) => {
  const user = await UserSchema.findOne({ _id: request.params.id });
  let result = "";
  if (user.active == true) {
    user.active = false;
    result = "not active";
  } else {
    user.active = true;
    result = "active";
  }

  await user.save();

  response.status(200).json(result);
});
