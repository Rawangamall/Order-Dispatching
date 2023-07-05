const mongoose = require('mongoose');

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
  };

const StatusLogsSchema = new mongoose.Schema({
  Status: { type: String, enum: ['confirm', 'picked', 'cancelled', 'assign', 'reassigned', 'delivered'], default: 'confirm', required: true },
  Time:{ type: Date, default: Date.now }
  })
   
   
const orderSchema = new mongoose.Schema({
   _id: { type: mongoose.Schema.Types.ObjectId}, //order code
  CustomerID: { type: mongoose.Schema.Types.ObjectId},
  CustomerName: { type: String, required: true },
  CustomerEmail: { type: String,validate:[validateEmail,"invalid email"], required: true },
  Address:{ 
  Governate: { type: String, required: true },
  City: { type: String, required: true },
  Area: { type: String, required: true },
  },
  TotalPrice: { type: Number, required: true },
  Status: { type: String, enum: ['confirm', 'picked', 'cancelled', 'assign', 'reassigned', 'delivered'], default: 'confirm', required: true },
  Product:[{
  product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name_en: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  }],
  PaymentMethod: { type: String, enum: ['Cash', 'Credit Card'], required: true },
 DriverID: { type: Number,ref: "Driver"},
 updated_status:{type:Number} ,
 statusLogs: [StatusLogsSchema]

},{ timestamps: true});

orderSchema.methods.changeOrderStatus = async function (orderId, newStatus) {
  return await this.model('order').findOneAndUpdate(
    { _id: orderId },
    { $push: { statusLogs: { Status: newStatus, Time: new Date() } } },
    { new: true }
  );
}

 mongoose.model('order', orderSchema);
