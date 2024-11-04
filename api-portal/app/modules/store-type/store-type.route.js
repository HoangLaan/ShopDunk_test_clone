const express = require('express');
const validate = require('express-validation');
const controller = require('./store-type.controller');
const routes = express.Router();
const prefix = '/store-type';
const rules = require('./store-type.rule');

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getStoreTypeList)
    .post(validate(rules.create), controller.createStoreType)
    .put(validate(rules.update), controller.updateStoreType)
    .delete(controller.deleteStoreType);

// Get detail
routes.route('/:store_type_id(\\d+)').get(controller.storeTypeDetail);

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
