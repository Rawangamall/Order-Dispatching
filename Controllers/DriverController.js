const mongoose=require("mongoose");
require("./../Models/DriverModel");

const DriverSchema=mongoose.model("driver");


exports.getDriverById=(request,response,next)=>{
    DriverSchema.findById(request.params.id)
                    .then((data)=>{
                        response.status(200).json(data);
                    })
                    .catch(error=>{
                        next(error);
                    })
}


exports.getAll = (request, response, next) => {
    const searchKey = request.body.searchKey?.toLowerCase() || "";
    const query = {
      $and: [
        {
          $or: [
            { DriverCode: { $regex: searchKey, $options: "i" } },
            { DriverName: { $regex: searchKey, $options: "i" } },
            { availability: { $regex: searchKey, $options: "i" } },
          ],
        }
    
      ],
    };
  
    DriverSchema.find(query)
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  };
  