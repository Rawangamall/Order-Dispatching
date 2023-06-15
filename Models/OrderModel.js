const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
  };

const orderSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId}, //order code
  CustomerID: { type: mongoose.Schema.Types.ObjectId},
  CustomerName: { type: String, required: true },
  CustomerEmail: { type: String,validate:[validateEmail,"invalid email"],unique:true , required: true },
  Address:{ 
  Governate: { type: String, required: true },
  City: { type: String, required: true },
  Area: { type: String, required: true },
  },
  TotalPrice: { type: Number, required: true },
  Status: { type: String, enum: ['confirm', 'picked', 'cancelled', 'assign', 'reassigned', 'delivered'], default: 'confirm', required: true },
  Product:[{
    ItemCode: { type: mongoose.Schema.Types.ObjectId, required: true },
  ItemName: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  }],
  PaymentMethod: { type: String, enum: ['cash', 'online'], required: true },
 DriverID: { type: Number,ref: "Driver"},
 updated_status:{type: Date, default: () => Date.now() + 1 * 60000 }
},{ timestamps: true});


// orderSchema.plugin(AutoIncrement,{id:'Order_Code',inc_field:" _id"});

 mongoose.model('order', orderSchema);
