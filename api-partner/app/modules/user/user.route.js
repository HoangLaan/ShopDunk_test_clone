const express = require('express');
const validate = require('express-validation');
const rules = require('./user.rule');
const userController = require('./user.controller');

const routes = express.Router();

const prefix = '/user';

// List user
routes.route('')
  .get(userController.getListUser);

// Create new a user
routes.route('')
  .post(validate(rules.createUser), userController.createUser);

// Generate username
routes.route('/create')
  .post(userController.generateUsername);

// List options function
routes.route('/get-options')
  .get(userController.getOptions);
// ISNOTIFY
routes.route('/notify')
  .put(userController.onoffNotify);
// APP
// Reset password 
routes.route('/password')
  .put(validate(rules.resetPassword), userController.resetPassword);

// Update token 
routes.route('/device-token')
  .put(validate(rules.updateDeviceToken), userController.updateDeviceToken)

// Change password a user
routes.route('/change-password')
  .put(validate(rules.changePasswordUser), userController.changePasswordUser);

// Detail a user
routes.route('/profile')
  .get(userController.detailUser);

// Get user by id
routes.route('/:userId')
  .get(userController.getById);

// Update a user
routes.route('/:userId')
  .put(validate(rules.updateUser), userController.updateUser);

// Delete a user
routes.route('/:userId')
  .delete(userController.deleteUser);


module.exports = {
  prefix,
  routes,
};
