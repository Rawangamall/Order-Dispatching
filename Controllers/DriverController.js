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
