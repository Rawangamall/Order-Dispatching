const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/LocationModel");
require("./../Models/DriverModel");

let Pusher = require('pusher');
const pusher = new Pusher({
	appId: "1621334",
	key: "bec24d45349a2eb1b439",
	secret: "377d841d412c45d14065",
	cluster: "eu",
	useTLS: true
  });

const orderSchema = mongoose.model("order");
const governateSchema = mongoose.model("Governate");
const driverSchema = mongoose.model("driver");``

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

// search by location name and return with area id for driver search
exports.assignOrder = catchAsync(async (request, response, next) => {
  const id = request.params._id;

  const order = await orderSchema.findById(id);
  // console.log("orderrrrrrrrr",order.Address.Governate);

  const governateName = order.Address.Governate;
  const cityName = order.Address.City;
  const areaName = order.Address.Area;

  const governate = await governateSchema.findOne({ governate: governateName });

  if (governate == "" || governate == null) {

    return next(new AppError("Governate not found", 401));
  }

  const city = governate.cities.find((c) => c.name === cityName);
  if (!city) {
    return next(new AppError("City not found", 401));
  }

  const area = city.areas.find((a) => a.name === areaName);
  if (area == "" || area == null) {
    return next(new AppError("Area not found", 401));
  }

  const driver = await driverSchema
    .findOne({
      areas: area._id,
      availability: "free",
    }).sort({ orderCount: 1 }).limit(1);

    console.log(driver);

   if (driver) {

    //assign order to the specific driver
    await orderSchema.updateOne(
      { _id: order._id },
      {
        $set: {
          DriverID: driver._id,
          Status: "assign",
          updated_status: Date.now() + 10 * 60 * 1000
        },
      }
    );

   // Trigger the notification event for the specific driver
   pusher.trigger(`driver-${driver._id}`, 'new-order');
    
   }
   else {
  //  if all driver is busy we will reassign the order
    await orderSchema.updateOne(
      { _id: order._id },
      {
        $set: {
          Status: "reassigned",
        },
      }
    );
    console.log(order.Status);
  }

});


const scheduleReAssignedOrder = () => {
  const updateAssignedOrders = async () => {
    try {
      console.log('select reassigned orders...');
      const reassignedOrderIds = await orderSchema.find({ Status: 'reassigned'},{_id:1});

      reassignedOrderIds.forEach(async (order_id) => {
        console.log("reassigned orderss: ",order_id);
         exports.assignOrder({ params: { _id:order_id } });
      });

    } catch (error) {
      console.error('Error updating orders:', error);
    }
  };

  updateAssignedOrders();
  setInterval(updateAssignedOrders, 1 * 60 * 1000);
};

scheduleReAssignedOrder();


// router.post('/posts/:id', (req, res, next) => {
//   Post.findByIdAndUpdate(req.params.id, {body: req.body.body}, (err, post) => {
//           let Pusher = require('pusher');
//           let pusher = new Pusher({
//               appId: process.env.PUSHER_APP_ID,
//               key: process.env.PUSHER_APP_KEY,
//               secret: process.env.PUSHER_APP_SECRET,
//               cluster: process.env.PUSHER_APP_CLUSTER
//           });

//           pusher.trigger('notifications', 'post_updated', post, req.headers['x-socket-id']);
//           res.send('');
//       });
// });

{/* <script src="https://js.pusher.com/4.1/pusher.min.js"></script>
<script>
    var pusher = new Pusher('your-app-key', { cluster: 'your-app-cluster' });

    // retrieve the socket ID once we're connected
    pusher.connection.bind('connected', function () {
        // attach the socket ID to all outgoing Axios requests
        axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
    });

    // request permission to display notifications, if we don't alreay have it
    Notification.requestPermission();
    pusher.subscribe('notifications')
            .bind('post_updated', function (post) {
                // if we're on the home page, show an "Updated" badge
                if (window.location.pathname === "/") {
                    $('a[href="/posts/' + post._id + '"]').append('<span class="badge badge-primary badge-pill">Updated</span>');
                }
                var notification = new Notification(post.title + " was just updated. Check it out.");
                notification.onclick = function (event) {
                    window.location.href = '/posts/' + post._id;
                    event.preventDefault();
                    notification.close();
                }
            });
</script> */}