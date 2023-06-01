const mongoose=require("mongoose");
require("./../Models/OrderModel")
const orderSchema = mongoose.model("order");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.getAll = catchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey?.toLowerCase()|| "";

    let objectId = "";
    if (mongoose.Types.ObjectId.isValid(searchKey)) {
         objectId = mongoose.Types.ObjectId(searchKey);
      }

    const query = {
      $and: [
        {
          $or: [
            {  _id: { $eq: objectId} },
            { CustomerName: { $regex: searchKey, $options: "i" } },
            { CustomerEmail: { $regex: searchKey, $options: "i" } },
            { Governate: { $regex: searchKey, $options: "i" } },
            { City: { $regex: searchKey, $options: "i" } },
            { Area: { $regex: searchKey, $options: "i" } },
            { PaymentMethod: { $regex: searchKey, $options: "i" } },
            { Status: { $regex: searchKey, $options: "i" } },
          ],
        }
      ],
    };
  
  const data =  await orderSchema.find(query)

if( data.length === 0){
  return next(new AppError("There's no data",401));
}

res.status(200).json({data});

});

