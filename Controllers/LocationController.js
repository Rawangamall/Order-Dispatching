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

exports.getallgovernate = catchAsync(async (request, response, next) => {
  const { searchKey, showNumber } = request.body;

  let query = {};

  if (searchKey) {
    const regex = new RegExp(searchKey, "i");
    query.governate = regex;
  }

  let data;
  if (showNumber) {
    data = await governateSchema.find(query).limit(showNumber);
  } else {
    data = await governateSchema.find(query);
  }

  const governates = data.map((item) => item.governate);
  response.status(200).json(governates);
});



exports.getOneGovernate = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const governate = await governateSchema.findById(_id).populate('cities.areas');
  
  if (!governate) {
    return next(new AppError(`Governate not found!`, 404));
  }
  
  const cities = governate.cities.map(city => {
    const areas = city.areas.map(area => area.name);
    return {
      city: city.name,
      areas: areas
    };
  });
  
  response.status(200).json({
    governate: governate.governate,
    cities: cities

  });
});

exports.editgovernate = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const { name } = request.body;
  const data = await governateSchema.findOne({ _id });
 
  if (!data) {
    return next(new AppError(`Governate not found!`, 404));
  }

  if (name !== "" && name) {
    data.governate = name;
    await data.save();
  } else {
    return next(new AppError(`Enter a valid name!`, 404));
  }

  response.status(200).json({ message: 'Governate updated successfully' });
});

exports.deleteGovernate = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findById(_id);
  
  if (!data) {
    return next(new AppError(`Governate not found!`, 404));
  }

  await governateSchema.findByIdAndDelete(_id);

  response.status(200).json({ message: "Success" });
});

exports.getallcities = catchAsync(async (request, response, next) => {
  const { searchKey, showNumber } = request.body;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: 'No cities found' });
  }

  let cities = data.flatMap(governate => governate.cities.map(city => city.name));

  if (searchKey) {
    const regex = new RegExp(searchKey, 'i');
    cities = cities.filter(city => regex.test(city));
  }

  if (showNumber) {
    cities = cities.slice(0, showNumber);
  }

  response.status(200).json(cities);
});



exports.getOneCity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ 'cities._id': _id });
  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }
  const city = data.cities.find(city => city._id.toString() === _id);
  const governate = data.governate;
  const areas = city.areas.map(area => area.name);
  response.status(200).json( {
      city: city.name,
      governate: governate,
      areas: areas
    });
});

exports.editcity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const { name } = request.body;
  const data = await governateSchema.findOne({ 'cities._id': _id });
 
  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }
  const cityIndex = data.cities.findIndex(city => city._id.toString() === _id);
  if(name !== "" && name){
    data.cities[cityIndex].name = name;
    await data.save();
  }else{
    return next(new AppError(`Enter a valid name!`, 404));
  }
  response.status(200).json({ message: 'City updated successfully' });
});

exports.deleteCity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ 'cities._id': _id });
  
  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }

  const cityIndex = data.cities.findIndex(city => city._id.toString() ===  _id);
  data.cities.splice(cityIndex, 1);

  await data.save();
  response.status(200).json({ message: "Success" });
});

exports.getallareas = catchAsync(async (request, response, next) => {
  const { searchKey, showNumber } = request.body;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: 'No areas found' });
  }

  let areas = data.flatMap(governate =>
    governate.cities.flatMap(city =>
      city.areas.map(area => area.name)
    )
  );

  if (searchKey) {
    const regex = new RegExp(searchKey, 'i');
    areas = areas.filter(area => regex.test(area));
  }

  if (showNumber) {
    areas = areas.slice(0, showNumber);
  }

  response.status(200).json(areas);
});



exports.getOneArea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ 'cities.areas._id': _id });
  if (!data) {
    return next(new AppError(`Area not found!`, 404));
  }
  const city = data.cities.find(city => city.areas.some(area => area._id.toString() === _id));
  const area = city.areas.find(area => area._id.toString() === _id);
  const governate = data.governate;
  response.status(200).json({
      area: area.name,
      city: city.name,
      governate: governate
});
});

exports.deletearea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ 'cities.areas._id': _id });
  if (!data) {
  
    return next(new AppError(`Area not found!`, 404));
  }
  const cityIndex = data.cities.findIndex(city => city.areas.some(area => area._id.toString() === _id));
  const areaIndex = data.cities[cityIndex].areas.findIndex(area => area._id.toString() === _id);

  data.cities[cityIndex].areas.splice(areaIndex, 1);
  await data.save();
  response.status(200).json({message:"success"});
});

exports.editarea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const { name } = request.body;
  const data = await governateSchema.findOne({ 'cities.areas._id': _id });
 
  if (!data) {
    return next(new AppError(`Area not found!`, 404));
  }
  const cityIndex = data.cities.findIndex(city => city.areas.some(area => area._id.toString() === _id));
  const areaIndex = data.cities[cityIndex].areas.findIndex(area => area._id.toString() === _id);
if(name !== "" && name){
 data.cities[cityIndex].areas[areaIndex].name = name;
  await data.save();
}else{
  return next(new AppError(`Enter a valid name!`, 404));
}
  response.status(200).json({ message: 'Area updated successfully' });
});


exports.UpdateLocation = catchAsync (async (request, response, next) => {

})

exports.DeleteLocation = catchAsync (async (request, response, next) => {

})

// search by location name and return with area id for driver search
  // exports.searchLocation = async (request, response, next) => {
    

  //   const { governateName, cityName, areaName } = request.body;
  
  //   try {
  //     const governate = await governateSchema.findOne({ governate: governateName }).exec();
  //     if (!governate) {
  //       return next(new AppError("Governate not found", 401));
  //     }
  
  //     const city = governate.cities.find(c => c.name === cityName);
  //     if (!city) {
  //       return next(new AppError("City not found", 401));
  //     }
  
  //     const area = city.areas.find(a => a.name === areaName);
  //     if (!area) {
  //       return next(new AppError("Area not found", 401));
  //     }
  
  //     response.json({ areaId: area._id });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
