const mongoose=require("mongoose");
require("./../Models/LocationModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const governateSchema=mongoose.model("Governate");
exports.addLocation = async (request, response, next) => {

  try {
    const { governate, city, area } = request.body;

    const existingGovernate = await governateSchema.findOne({ governate: governate });

    if (existingGovernate) {
      const existingCity = existingGovernate.cities.find(c => c.name === city);

      if (existingCity) {
        const existingArea = existingCity.areas.find(a => a.name === area);

        if (existingArea) {
          response.status(200).json(existingGovernate);
        } else {
          existingCity.areas.push({ name: area });
          await existingGovernate.save();
          response.status(200).json(existingGovernate);
        }
      } else {
        existingGovernate.cities.push({
          name: city,
          areas: [{ name: area }]
        });
        await existingGovernate.save();
        response.status(200).json(existingGovernate);
      }
    } else {
      const location = new governateSchema({
        governate: governate,
        cities: [{
          name: city,
          areas: [{ name: area }]
        }]
      });

      const data = await location.save();
      const formattedData = {
        governate: data.governate,
        cities: data.cities.map(city => {
          return {
            name: city.name,
            areas: city.areas.map(area => {
              return {
                name: area.name
              }
            })
          }
        })
      };
      response.status(201).json(formattedData);
    }
  } catch (error) {
    next(error);
  }
}


exports.getallgovernate = catchAsync(async (request, response, next) => {
  const { searchkey, shownumber } = request.headers;

  let query = {};

  if (searchkey) {
    const regex = new RegExp(searchkey, "i");
    query.governate = regex;
  }

  let data;
  if (shownumber) {
    data = await governateSchema.find(query).limit(shownumber);
  } else {
    data = await governateSchema.find(query);
  }
  const totalOrders = await governateSchema.countDocuments();
  const governates = data.map((item) => item.governate);
  response.status(200).json({governates , totalOrders});
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
  const { searchkey, shownumber } = request.headers;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: 'No cities found' });
  }

  let cities = data.flatMap(governate => governate.cities.map(city => city.name));
      const citiesNum = cities.length
  if (searchkey) {
    const regex = new RegExp(searchkey, 'i');
    cities = cities.filter(city => regex.test(city));
  }

  if (shownumber) {
    cities = cities.slice(0, shownumber);
  }

  response.status(200).json({cities,citiesNum});
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
  const { searchkey, shownumber } = request.headers;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: 'No areas found' });
  }

  let areas = data.flatMap(governate =>
    governate.cities.flatMap(city =>
      city.areas.map(area => area.name)
    )
  );
 const areasNum = areas.length
  if (searchkey) {
    const regex = new RegExp(searchkey, 'i');
    areas = areas.filter(area => regex.test(area));
  }

  if (shownumber) {
    areas = areas.slice(0, shownumber);
  }

  response.status(200).json({areas,areasNum});
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


