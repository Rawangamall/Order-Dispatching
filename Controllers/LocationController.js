const mongoose=require("mongoose");
require("./../Models/LocationModel");

const governateSchema=mongoose.model("Governate");
const citySchema=mongoose.model("City");
const areaSchema=mongoose.model("Area");
const locationSchema=mongoose.model("Location");

// Governate Cruds
exports.getGovernateById=(request,response,next)=>{
    governateSchema.findById(request.params.id)
                    .then((data)=>{
                        if (data == null) {
                            throw new Error("Not Found");
                          } else {
                            response.status(200).json(data);
                          }                    })
                    .catch(error=>{
                        next(error);
                    })
}


exports.getAllGovernates = (request, response, next) => {
    const searchKey = request.body.searchKey?.toLowerCase() || "";
    const query = {
      $and: [
        {
          $or: [
            { governateName: { $regex: searchKey, $options: "i" } },
          ],
        }
    
      ],
    };
  
    governateSchema.find(query)
      .then((data) => {
        if (data == null) {
            throw new Error("Not Found");
          } else {
            response.status(200).json(data);
          }      })
      .catch((error) => {
        next(error);
      });
  };
  

  exports.addGovernate = async (request, response, next) => {
    try {
      const governate = new governateSchema({
        _id: request.body._id,
        governateName: request.body.governateName,
        governateCode: request.body.governateCode,
      });
      const data = await governate.save();
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };


  exports.updateGovernate = (request, response, next) => {
   
    governateSchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
        governateName: request.body.governateName,
        governateCode: request.body.governateCode,
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


  exports.deleteGovernate=(request,response,next)=>{
    governateSchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}

// City Cruds

exports.getCityById=(request,response,next)=>{
    citySchema.findById(request.params.id)
                    .then((data)=>{
                        if (data == null) {
                            throw new Error("Not Found");
                          } else {
                            response.status(200).json(data);
                          }
                                            })
                    .catch(error=>{
                        next(error);
                    })
}


exports.getAllCities = (request, response, next) => {
    const searchKey = request.body.searchKey?.toLowerCase() || "";
    const query = {
      $and: [
        {
          $or: [
            { cityName: { $regex: searchKey, $options: "i" } },
            // { cityCode: { $regex: searchKey, $options: "i" } },
            // { cityParent: { $regex: searchKey, $options: "i" } },
          ],
        }
    
      ],
    };
  
    citySchema.find(query)
      .then((data) => {
        if (data == null) {
            throw new Error("Not Found");
          } else {
            response.status(200).json(data);
          }      })
      .catch((error) => {
        next(error);
      });
  };
  

  exports.addCity = async (request, response, next) => {
    try {
      const city = new citySchema({
        _id: request.body._id,
        cityName: request.body.cityName,
        cityCode: request.body.cityCode,
        cityParent: request.body.cityParent,
      });
      const data = await city.save();
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };


  exports.updateCity = (request, response, next) => {
   
    citySchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
            cityName: request.body.cityName,
            cityCode: request.body.cityCode,
            cityParent: request.body.cityParent,
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


  exports.deleteCity=(request,response,next)=>{
    citySchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}


// Area Cruds

exports.getAreaById=(request,response,next)=>{
    citySchema.findById(request.params.id)
                    .then((data)=>{
                        if (data == null) {
                            throw new Error("Not Found");
                          } else {
                            response.status(200).json(data);
                          }                    })
                    .catch(error=>{
                        next(error);
                    })
}


exports.getAllAreas = (request, response, next) => {
    const searchKey = request.body.searchKey?.toLowerCase() || "";
    const query = {
      $and: [
        {
          $or: [
            { areaName: { $regex: searchKey, $options: "i" } },
            // { areaCode: { $regex: searchKey, $options: "i" } },
            // { areaParent: { $regex: searchKey, $options: "i" } },
          ],
        }
    
      ],
    };
  
    areaSchema.find(query)
      .then((data) => {
        if (data == null) {
            throw new Error("Not Found");
          } else {
            response.status(200).json(data);
          }      })
      .catch((error) => {
        next(error);
      });
  };
  

  exports.addArea = async (request, response, next) => {
    try {
      const area = new areaSchema({
        _id: request.body._id,
        areaName: request.body.areaName,
        areaCode: request.body.areaCode,
        areaParent: request.body.areaParent,
      });
      const data = await area.save();
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };


  exports.updateArea = (request, response, next) => {
   
    areaSchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
        areaName: request.body.areaName,
        areaCode: request.body.areaCode,
        areaParent: request.body.areaParent,
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


  exports.deleteArea=(request,response,next)=>{
    areaSchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}

// Location Cruds


exports.getLocationById=(request,response,next)=>{
    locationSchema.findById(request.params.id)
                    .then((data)=>{
                        if (data == null) {
                            throw new Error("Not Found");
                          } else {
                            response.status(200).json(data);
                          }                    })
                    .catch(error=>{
                        next(error);
                    })
}




exports.getAllLocations = (request, response, next) => {
    locationSchema
    .find({})
    .then((data) => {
        if (data == null) {
            throw new Error("Not Found");
          } else {
            response.status(200).json(data);
          }
            })
    .catch((error) => {
      next(error);
    });
  };
  

  exports.addLocation = async (request, response, next) => {
    try {
      const location = new locationSchema({
        _id: request.body._id,
        governateId: request.body.governateId,
        cityId: request.body.cityId,
        areaId: request.body.areaId,
      });
      const data = await location.save();
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };


  exports.updateLocation = (request, response, next) => {
   
    areaSchema.updateOne(
      {
        _id: request.params._id
      },
      {
        $set: {
        areaName: request.body.areaName,
        areaCode: request.body.areaCode,
        areaParent: request.body.areaParent,
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


  exports.deleteLocation=(request,response,next)=>{
    areaSchema.deleteOne({
        _id:request.params.id
    })
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch(error=>{
        next(error);
    })
}
