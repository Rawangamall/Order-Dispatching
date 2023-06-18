const mongoose = require("mongoose");
require("./../Models/RoleModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const UserSchema = mongoose.model("user");
const RoleSchema = mongoose.model("role");

exports.getRoles = async (request, response, next) => {
	try {
		const roleNum = request.headers.rolenum || null;
		
		const limit = parseInt(roleNum) || 7;

		const roles = await RoleSchema.find().limit(limit);
		const rolesCount = await RoleSchema.countDocuments();
		response.json({ roles , rolesCount });
	} catch (error) {
		console.log(error);
		response
			.status(500)
			.json({
				error: "An error occurred while fetching roles",
				details: error.message,
			});
	}
};




 
  exports.addRole = async (request, response, next) => {
	try {
	  const { user_id, name, permissions } = request.body;
  
	  // Check if the user_id exists
	  const existingUser = await UserSchema.findOne({ _id: user_id });
	  if (!existingUser) {
		return response.status(400).json({ error: 'User with the specified user_id does not exist' });
	  }
  
	  // Check if the role name already exists
	  const existingRole = await RoleSchema.findOne({ name });
	  if (existingRole) {
		return response.status(400).json({ error: 'Role with the same name already exists' });
	  }
  
	 // Create a new role
	 const role = new RoleSchema({
        user_id,
        name,
        permissions: {
          statistics: {
            viewAll: permissions.statistics.viewAll
          },
          users: {
            viewAll: permissions.users.viewAll,
            add: permissions.users.add,
            edit: permissions.users.edit,
            delete: permissions.users.delete,
            activateDeactivate: permissions.users.activateDeactivate
          },
          orders: {
            viewAll: permissions.orders.viewAll
          },
          customers: {
            viewAll: permissions.customers.viewAll
          },
          locations: {
            view: permissions.locations.view,
            add: permissions.locations.add,
            edit: permissions.locations.edit,
			delete: permissions.locations.delete
          },
          drivers: {
            viewAll: permissions.drivers.viewAll,
            add: permissions.drivers.add,
            edit: permissions.drivers.edit,
            delete: permissions.drivers.delete
          },
          roles: {
            viewAll: permissions.roles.viewAll,
            add: permissions.roles.add,
            edit: permissions.roles.edit
          }
        }
      });
  
	  // Save the role to the database
	  await role.save();
  
	  response.status(201).json({ message: 'Role created successfully', role });
	} catch (error) {
	  console.error(error);
	  response.status(500).json({ error: 'An error occurred while creating the role', details: error.message });
	}
  };


exports.updateRole = async (request, response, next) => {
	try {
		const { id } = request.params;
		const { permissions } = request.body;
		const { name } = request.body;

		// Find the role by its ID
		const role = await RoleSchema.findById(id);

		if (!role) {
			return response.status(404).json({ error: "Role not found" });
		}

		// Update specific fields of the role
		if (name) {
			role.name = name;
		}

		if (permissions && permissions.statistics) {
			role.permissions.statistics = permissions.statistics;
		}

		if (permissions && permissions.users) {
			role.permissions.users.viewAll = permissions.users.viewAll;
			role.permissions.users.add = permissions.users.add;
			role.permissions.users.edit = permissions.users.edit;
			role.permissions.users.activateDeactivate =
				permissions.users.activateDeactivate;
		}

		if (permissions && permissions.orders) {
			role.permissions.orders.viewAll = permissions.orders.viewAll;
		}

		if (permissions && permissions.customers) {
			role.permissions.customers.viewAll = permissions.customers.viewAll;
		}

		if (permissions && permissions.locations) {
			role.permissions.locations.view = permissions.locations.view;
			role.permissions.locations.add = permissions.locations.add;
			role.permissions.locations.edit = permissions.locations.edit;
			role.permissions.locations.delete = permissions.locations.delete;
		}

		if (permissions && permissions.drivers) {
			role.permissions.drivers.viewAll = permissions.drivers.viewAll;
			role.permissions.drivers.add = permissions.drivers.add;
			role.permissions.drivers.edit = permissions.drivers.edit;
		}

		if (permissions && permissions.roles) {
			role.permissions.roles.viewAll = permissions.roles.viewAll;
			role.permissions.roles.add = permissions.roles.add;
			role.permissions.roles.edit = permissions.roles.edit;
		}

		// Update other fields in a similar way

		// Save the updated role
		await role.save();

		response.json({ message: "Role updated successfully", role });
	} catch (error) {
		console.error(error);
		response
			.status(500)
			.json({
				error: "An error occurred while updating the role",
				details: error.message,
			});
	}
};

exports.getRoleById = (request, response, next) => {
	RoleSchema.findById(request.params.id)
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};
