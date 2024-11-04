const express = require('express');
const validate = require('express-validation');
const storeController = require('./store.controller');
const routes = express.Router();
const rules = require('./store.rule');
const prefix = '/store';

// get options
routes.route('/get-options').get(storeController.getOptions);

// List store
routes.route('').get(storeController.getListStore);

// Detail a store
routes.route('/:storeId(\\d+)').get(storeController.detailStore);

// Create new a store
routes.route('').post(validate(rules.createStore), storeController.createStore);

// Update a store
routes.route('/:storeId(\\d+)').put(validate(rules.updateStore), storeController.updateStore);

// Delete a store
routes.route('/delete').post(validate(rules.deleteStore), storeController.deleteStore);

// Detail a store
routes.route('/deboune').get(storeController.getListStoreWithDeboune);

// get opt by username
routes.route('/get-opts-by-user').get(storeController.getOptionsByUser);
// get opt by username
routes.route('/get-opts-by-user-have-stocks-warranty').get(storeController.getOptsByUserHaveStocksWarranty);

module.exports = {
    prefix,
    routes,
};
