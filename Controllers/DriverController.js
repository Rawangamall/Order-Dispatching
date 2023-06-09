const mongoose=require("mongoose");
require("./../Models/DriverModel");
require("./../Models/OrderModel");

const OrderSchema=mongoose.model("order");

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
            // { DriverCode: { $regex: searchKey, $options: "i" } },
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
  
  exports.addDriver =  async (req, res) => {
    try {
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

      });
  
      // Save the driver to the database
      await driver.save();
  
      // Send a success response
      res.status(200).json({ message: 'Driver added successfully' , driver});
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  exports.updateDriver = async (req, res) => {
    try {
    
      const { id, driverName, status, availability, email, phoneNumber, areas, orderCount } = req.body;
      
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
      res.status(200).json({ message: 'Driver updated successfully', driver });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
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


exports.getDriversToBeAssignedOrderTo = async (request, response, next) => {
  try {
    const areaId = request.params.id;

    // Find one driver with the specified area_id and availability
    const driver = await DriverSchema.findOne({ areas: areaId, availability: 'free' }).limit(1);

    if (driver) {
      // Update the driver's availability to 'busy'
      if(driver.orderCount==1)
      {
        driver.orderCount=2;
        driver.availability = 'busy';
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
      response.json({ message: 'No available drivers found' });
    }
  } catch (error) {
    next(error);
  }
};







