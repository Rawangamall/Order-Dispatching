const mongoose=require("mongoose");
require("./../Models/LocationModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const governateSchema=mongoose.model("Governate");

exports.addLocation = async (request, response, next) => {
  try {
    const { governate, cities } = request.body;

    const existingGovernate = await governateSchema.findOne({ governate: governate });

    if (existingGovernate) {
      for (const city of cities) {
        const existingCity = existingGovernate.cities.find(c => c.name === city.name);

        if (existingCity) {
          // Add areas to the existing city
          for (const area of city.areas) {
            if (!existingCity.areas.some(a => a.name === area.name)) {
              existingCity.areas.push(area);
            }
          }
        } else {
          // Add the new city with its areas
          existingGovernate.cities.push(city);
        }
      }

      await existingGovernate.save();
      response.status(200).json(existingGovernate);
    } else {

     const formattedCities = cities.map(city => ({
      name: city.name,
      areas: city.areas
    }));

    const location = new governateSchema({
      governate: governate,
      cities: formattedCities
    });
      const data = await location.save();
      response.status(201).json(data);
    }
  } catch (error) {
    next(error);
  }
};


// search by location name and return with area id for driver search
  exports.searchLocation = async (request, response, next) => {
    

    const { governateName, cityName, areaName } = request.body;
  
    try {
      const governate = await governateSchema.findOne({ governate: governateName }).exec();
      if (!governate) {
        return next(new AppError("Governate not found", 401));
      }
  
      const city = governate.cities.find(c => c.name === cityName);
      if (!city) {
        return next(new AppError("City not found", 401));
      }
  
      const area = city.areas.find(a => a.name === areaName);
      if (!area) {
        return next(new AppError("Area not found", 401));
      }
  
      response.json({ areaId: area._id });
    } catch (error) {
      next(error);
    }
  };
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
