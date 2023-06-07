const mongoose = require('mongoose')

const AutoIncrement = require('mongoose-sequence')(mongoose);


const schema = new mongoose.Schema({
    _id : Number,
    user_id: {
      type: Number,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: {
      statistics: {
        viewAll: {
          type: Boolean,
          default: false
        }
      },
      users: {
        viewAll: {
          type: Boolean,
          default: false
        },
        add: {
          type: Boolean,
          default: false
        },
        edit: {
          type: Boolean,
          default: false
        },
        delete: {
          type: Boolean,
          default: false
        },
        activateDeactivate: {
          type: Boolean,
          default: false
        }
      },
      orders: {
        viewAll: {
          type: Boolean,
          default: false
        },
        add: {
          type: Boolean,
          default: false
        },
        edit: {
          type: Boolean,
          default: false
        },
        delete: {
          type: Boolean,
          default: false
        }
      },
      customers: {
        viewAll: {
          type: Boolean,
          default: false
        }
      },
      locations: {
        view: {
          type: Boolean,
          default: false
        },
        add: {
          type: Boolean,
          default: false
        },
        edit: {
          type: Boolean,
          default: false
        }
      },
      drivers: {
        viewAll: {
          type: Boolean,
          default: false
        },
        add: {
          type: Boolean,
          default: false
        },
        edit: {
          type: Boolean,
          default: false
        },
        delete: {
          type: Boolean,
          default: false
        }
      },
      roles: {
        viewAll: {
          type: Boolean,
          default: false
        },
        add: {
          type: Boolean,
          default: false
        },
        edit: {
          type: Boolean,
          default: false
        }
      }
    }
  });
  schema.plugin(AutoIncrement,{id:'role_id',inc_field:"_id"});


//mapping

mongoose.model("role", schema);