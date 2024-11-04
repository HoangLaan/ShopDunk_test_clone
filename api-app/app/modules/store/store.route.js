const express = require('express');
const validate = require('express-validation');
const storeController = require('./store.controller');
const routes = express.Router();
const rules = require('./store.rule');
const prefix = '/store';


// List store
routes.route('')
  .get(storeController.getListStore);

// Detail a area
routes.route('/:storeId(\\d+)')
  .get(storeController.detailStore);

// Create new a area
routes.route('')
  .post(validate(rules.createStore),storeController.createStore);

// Update a area
routes.route('/:storeId(\\d+)')
  .put(validate(rules.updateStore),storeController.updateStore);

// Change status a area
routes.route('/:storeId/change-status')
  .put(validate(rules.changeStatusStore), storeController.changeStatusStore);

// Delete a area
routes.route('/:storeId(\\d+)')
  .delete(storeController.deleteStore);

// List options area
routes.route('/get-options')
  .get(storeController.getOptions);

// Check ip
routes.route('/check-ip')
  .get(storeController.checkIp);

// Get store by user
routes.route('/get-store-user')
  .get(storeController.getStoreByUser);

module.exports = {
  prefix,
  routes,
};
