const mongoose = require("mongoose");
const CatchAsync = require("../utils/CatchAsync");
require("./../Models/DriverModel");
require("./../Models/OrderModel");
const OrderSchema = mongoose.model("order");
const DriverSchema = mongoose.model("driver");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


exports.getDriverById = (request, response, next) => {
  
  DriverSchema.findById(request.params.id)
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

// exports.getAll = (request, response, next) => {
//   const searchkey = request.headers.searchkey?.toLowerCase() || "";
//   const query = {
//     $and: [
//       {
//         $or: [
//           { DriverName: { $regex: searchkey, $options: "i" } },
//           { availability: { $regex: searchkey, $options: "i" } },
//         ],
//       },
//     ],
//   };

//
//     .then((data) => {
//       response.status(200).json({ data});
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

exports.getAll = CatchAsync(async (request, response, next) => {
  const searchKey = request.headers.searchkey || "";
  const driverNum = request.headers.drivernum || null;

  let query = {};

  if (searchKey) {
    query = {
      $and: [
        {
          $or: [
            { driverName: { $regex: searchKey, $options: "i" } },
            { availability: { $regex: searchKey, $options: "i" } },
          ],
        },
      ],
    };
  }

  let limit = null;
  if (driverNum !== null) {
    limit = parseInt(driverNum);
  }
  const data = await DriverSchema.find(query).limit(limit);
  const totalCount = await DriverSchema.countDocuments();

  response.status(200).json({ data, totalCount });
});

exports.addDriver = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, salt);
    // Extract the request body
    const {
      driverName,
      status,
      availability,
      email,
      phoneNumber,
      areas,
      orderCount,
    } = req.body;

    // Create a new driver object
    const driver = new DriverSchema({
      driverName,
      status,
      availability,
      email,
      phoneNumber,
      areas,
      orderCount,
      password : hash
    });

    // Save the driver to the database
    await driver.save();

    // Send a success response
    res.status(200).json({ message: "Driver added successfully", driver });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      driverName,
      status,
      availability,
      email,
      phoneNumber,
      areas,
      orderCount,
    } = req.body;

    // Find the driver by ID
    const driver = await DriverSchema.findById(id);

    // Update the driver fields
    driver.driverName = driverName;
    driver.status = status;
    driver.availability = availability;
    driver.email = email;
    driver.phoneNumber = phoneNumber;
    driver.areas = areas;
    driver.orderCount = orderCount;

    // Save the updated driver to the database
    await driver.save();

    // Send a success response
    res.status(200).json({ message: "Driver updated successfully", driver });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.BanDriver = CatchAsync(async (request, response, next) => {
  const driver = await DriverSchema.findOne({ _id: request.params.id });
  let result = "";
  if (driver.status === "active") {
    driver.status = "not active";
    result = "active";
  } else {
    driver.status = "active";
    result = "not active";
  }

  await driver.save();

  response.status(200).json(result);
});

exports.deleteDriver = (request, response, next) => {
  const driverId = request.params.id;

  // Check if there are any orders with status "assigned" or "picked" associated with the driver
  OrderSchema.find({
    DriverID: driverId,
    Status: { $in: ['assign', 'picked'] }
  })
    .then((orders) => {
      if (orders.length > 0) {
        // Update the status of associated orders to "reassigned"
        const updatePromises = orders.map(order => {
          order.Status = 'reassigned';
          return order.save();
        });

        Promise.all(updatePromises)
          .then(() => {
            // All orders updated successfully, proceed with deleting the driver
            DriverSchema.deleteOne({ _id: driverId })
              .then((data) => {
                response.status(200).json(data);
              })
              .catch((error) => {
                next(error);
              });
          })
          .catch((error) => {
            next(error);
          });
      } else {
        // No orders with "assigned" or "picked" status found, proceed with deleting the driver
        DriverSchema.deleteOne({ _id: driverId })
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      next(error);
    });
};


exports.getDriversToBeAssignedOrderTo = async (request, response, next) => {
  try {
    const areaId = request.params.id;

    // Find one driver with the specified area_id and availability
    const driver = await DriverSchema.findOne({
      areas: areaId,
      availability: "free",
    }).limit(1);

    if (driver) {
      // Update the driver's availability to 'busy'
      if (driver.orderCount == 1) {
        driver.orderCount = 2;
        driver.availability = "busy";
      }

      await driver.save();

      // Assign the driver_id in the order data
      const orderId = request.body.orderId;
      const order = await OrderSchema.findById(orderId);
      order.DriverID = driver._id;
      await order.save();

      // Return the driver data
      response.json(driver);
    } else {
      response.json({ message: "No available drivers found" });
    }
  } catch (error) {
    next(error);
  }
};
