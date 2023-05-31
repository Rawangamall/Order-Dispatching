const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
  };

const orderSchema = new mongoose.Schema({
  OrderCode: { type: Number, required: true },
  CustomerID: { type: Number, required: true },
  CustomerName: { type: String, required: true },
  CustomerEmail: { type: String,validate:[validateEmail,"invalid email"],unique:true , required: true },
  Governate: { type: String, required: true },
  Area: { type: String, required: true },
  City: { type: String, required: true },
  CustomerGroup: { type: String, required: true },
  TotalPrice: { type: Number, required: true },
  Status: { type: String, enum: ['confirm', 'picked', 'cancelled', 'assign', 'reassigned', 'delivered'], default: 'confirm', required: true },
  ItemCode: { type: String, required: true },
  ItemName: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  PaymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  DriverID: { type: Number, required: true }
});

schema.plugin(AutoIncrement,{id:'OrderCode',inc_field:"_id"});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
