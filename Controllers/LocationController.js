const mongoose=require("mongoose");
require("./../Models/LocationModel");

const governateSchema=mongoose.model("Governate");


exports.addLocation = async (request, response, next) => {
    try {
      const { governate, city, area } = request.body;
  
      const location = new governateSchema({
        governate: governate,
        cities: [{
          name: city,
          areas: [{
            name: area
          }]
        }]
      });
  
      const data = await location.save();
      response.status(201).json(data);
    } catch (error) { 
      next(error);
    }
  };
  
// search by location name and return with area id for driver search
// const areaName = 'Nasr City';
// const cityName = 'Cairo';
// const governateName = 'Cairo';

// Area.findOne({ name: areaName })
//   .populate({
//     path: 'city',
//     match: { name: cityName },
//     populate: {
//       path: 'governate',
//       match: { governate: governateName },
//       select: '_id'
//     }
//   })
//   .exec((err, area) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(area._id);
//     }
//   });
