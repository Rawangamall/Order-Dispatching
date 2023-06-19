const mongoose = require("mongoose");
require("./../Models/LocationModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
require("./../Models/DriverModel");

const DriverSchema = mongoose.model("driver");
const governateSchema = mongoose.model("Governate");
exports.addLocation = async (request, response, next) => {
  try {
    const { governate, city, area } = request.body;

    const existingGovernate = await governateSchema.findOne({
      governate: governate,
    });

    if (existingGovernate) {
      const existingCity = existingGovernate.cities.find(
        (c) => c.name === city
      );

      if (existingCity) {
        const existingArea = existingCity.areas.find((a) => a.name === area);

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
          areas: [{ name: area }],
        });
        await existingGovernate.save();
        response.status(200).json(existingGovernate);
      }
    } else {
      const location = new governateSchema({
        governate: governate,
        cities: [
          {
            name: city,
            areas: [{ name: area }],
          },
        ],
      });

      const data = await location.save();
      const formattedData = {
        governate: data.governate,
        cities: data.cities.map((city) => {
          return {
            name: city.name,
            areas: city.areas.map((area) => {
              return {
                name: area.name,
              };
            }),
          };
        }),
      };
      response.status(201).json(formattedData);
    }
  } catch (error) {
    next(error);
  }
};

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

  const totalCount = await governateSchema.countDocuments();

  const location = data.map((item) => {
    const { _id, governate } = item;
    return { id: _id, name: governate };
  });

  response.status(200).json({ location, totalCount });
});

exports.getOneGovernate = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const governate = await governateSchema
    .findById(_id)
    .populate("cities.areas");

  if (!governate) {
    return next(new AppError(`Governate not found!`, 404));
  }

  const cities = governate.cities.map((city) => {
    const areas = city.areas.map((area) => area.name);
    return {
      city: city.name,
      areas: areas,
    };
  });

  response.status(200).json({
    governate: governate.governate,
    cities: cities,
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

  response.status(200).json({ message: "Governate updated successfully" });
});

exports.deleteGovernate = catchAsync(async (request, response, next) => {
  const { _id } = request.params;

  const governateData = await governateSchema.findById(_id);
  if (!governateData) {
    return next(new AppError(`Governate not found!`, 404));
  }

  const deletedAreas = [];
  for (const city of governateData.cities) {
    deletedAreas.push(...city.areas);
  }

  await governateSchema.findByIdAndDelete(_id);

  const drivers = await DriverSchema.find({ areas: { $in: deletedAreas } });
  if (drivers.length !== 0) {
    for (const driver of drivers) {
      for (const deletedArea of deletedAreas) {
        const driverAreaIndex = driver.areas.findIndex((area) => area === parseInt(deletedArea._id));
        if (driverAreaIndex !== -1) {
          driver.areas.splice(driverAreaIndex, 1);
          await driver.save();
        }
      }
    }
  }

  response.status(200).json({ message: "Success" });
});


exports.getallcities = catchAsync(async (request, response, next) => {
  const { searchkey, shownumber } = request.headers;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: "No cities found" });
  }

  let cities = [];

  data.forEach((governate) => {
    governate.cities.forEach((city) => {
      const { _id, name } = city;
      cities.push({ id: _id, name });
    });
  });

  let filteredCities = cities;

  if (searchkey) {
    const regex = new RegExp(searchkey, "i");
    filteredCities = cities.filter((city) => regex.test(city.name));
  }

  const totalCount = filteredCities.length;

  if (shownumber) {
    filteredCities = filteredCities.slice(0, shownumber);
  }

  response.status(200).json({ location: filteredCities, totalCount });
});

exports.getOneCity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ "cities._id": _id });
  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }
  const city = data.cities.find((city) => city._id.toString() === _id);
  const governate = data.governate;
  const areas = city.areas.map((area) => area.name);
  response.status(200).json({
    city: city.name,
    governate: governate,
    areas: areas,
  });
});

exports.editcity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const { name } = request.body;
  const data = await governateSchema.findOne({ "cities._id": _id });

  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }
  const cityIndex = data.cities.findIndex(
    (city) => city._id.toString() === _id
  );
  if (name !== "" && name) {
    data.cities[cityIndex].name = name;
    await data.save();
  } else {
    return next(new AppError(`Enter a valid name!`, 404));
  }
  response.status(200).json({ message: "City updated successfully" });
});

exports.deleteCity = catchAsync(async (request, response, next) => {
  const { _id } = request.params;

  const data = await governateSchema.findOne({ "cities._id": _id });
  if (!data) {
    return next(new AppError(`City not found!`, 404));
  }

  const cityIndex = data.cities.findIndex((city) => city._id.toString() === _id);
  const deletedAreas = data.cities[cityIndex].areas;
  console.log(deletedAreas)
  data.cities.splice(cityIndex, 1);
  await data.save();

  const drivers = await DriverSchema.find({ areas: { $in: deletedAreas} });
  if (drivers.length !== 0) {
    console.log(drivers)
    for (const driver of drivers) {
      for (const deletedArea of deletedAreas) {
        const driverAreaIndex = driver.areas.findIndex((area) => area === parseInt(deletedArea._id));
        if (driverAreaIndex !== -1) {
          driver.areas.splice(driverAreaIndex, 1);
          await driver.save();
        }
      }
    }
  }

  response.status(200).json({ message: "Success" });
});


exports.getallareas = catchAsync(async (request, response, next) => {
  const { searchkey, shownumber } = request.headers;

  const data = await governateSchema.find({});
  if (!data || !data.length) {
    return response.status(404).json({ message: "No areas found" });
  }

  let areas = [];

  data.forEach((governate) => {
    governate.cities.forEach((city) => {
      city.areas.forEach((area) => {
        const { _id, name } = area;
        areas.push({ id: _id, name });
      });
    });
  });

  let filteredAreas = areas;

  if (searchkey) {
    const regex = new RegExp(searchkey, "i");
    filteredAreas = areas.filter((area) => regex.test(area.name));
  }

  const totalCount = filteredAreas.length;

  if (shownumber) {
    filteredAreas = filteredAreas.slice(0, shownumber);
  }

  response.status(200).json({ location: filteredAreas, totalCount });
});

exports.getOneArea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ "cities.areas._id": _id });
  if (!data) {
    return next(new AppError(`Area not found!`, 404));
  }
  const city = data.cities.find((city) =>
    city.areas.some((area) => area._id.toString() === _id)
  );
  const area = city.areas.find((area) => area._id.toString() === _id);
  const governate = data.governate;
  response.status(200).json({
    area: area.name,
    city: city.name,
    governate: governate,
  });
});

exports.deletearea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const data = await governateSchema.findOne({ "cities.areas._id": _id });
  if (!data) {
    return next(new AppError(`Area not found!`, 404));
  }
  
  const cityIndex = data.cities.findIndex((city) =>
    city.areas.some((area) => area._id.toString() === _id)
  );
  
  const areaIndex = data.cities[cityIndex].areas.findIndex(
    (area) => area._id.toString() === _id
  );

  data.cities[cityIndex].areas.splice(areaIndex, 1);
  
  const drivers = await DriverSchema.find({areas:_id }); 
  if (drivers || drivers.length !== 0) {
    
  for (const driver of drivers) {
    const driverAreaIndex = driver.areas.findIndex((area) => area === parseInt(_id));
    if (driverAreaIndex !== -1) {
      driver.areas.splice(driverAreaIndex, 1);
      await driver.save();
    }
  }
}
  await data.save();
  response.status(200).json({ message: "success" });
});


exports.editarea = catchAsync(async (request, response, next) => {
  const { _id } = request.params;
  const { name } = request.body;
  const data = await governateSchema.findOne({ "cities.areas._id": _id });

  if (!data) {
    return next(new AppError(`Area not found!`, 404));
  }
  const cityIndex = data.cities.findIndex((city) =>
    city.areas.some((area) => area._id.toString() === _id)
  );
  const areaIndex = data.cities[cityIndex].areas.findIndex(
    (area) => area._id.toString() === _id
  );
  if (name !== "" && name) {
    data.cities[cityIndex].areas[areaIndex].name = name;
    await data.save();
  } else {
    return next(new AppError(`Enter a valid name!`, 404));
  }
  response.status(200).json({ message: "Area updated successfully" });
});
