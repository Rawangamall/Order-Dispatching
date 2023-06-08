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
  

  exports.addDriver = async (request, response, next) => {
    try {
      const driver = new DriverSchema({
        _id: request.body._id,
        driverName: request.body.driverName,
        driverCode: request.body.driverCode,
        availability: request.body.availability,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        locationId: request.body.locationId,
        orderCount: request.body.orderCount,
      });
      const data = await driver.save();
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };


  exports.updateDriver = (request, response, next) => {
   
    DriverSchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
            driverName: request.body.driverName,
            driverCode: request.body.driverCode,
            availability: request.body.availability,
            email: request.body.email,
            phoneNumber: request.body.phoneNumber,
            locationId: request.body.locationId,
            orderCount: request.body.orderCount,
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


  exports.deleteDriver=(request,response,next)=>{
    DriverSchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}