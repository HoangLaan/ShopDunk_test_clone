const express = require('express');
const validate = require('express-validation');
const controller = require('./business.controller');
const routes = express.Router();
const prefix = '/business';
const rules = require('./business.rule');

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getBusinessList)
    .post(validate(rules.createBusiness), controller.createBusiness)
    .put(validate(rules.updateBusiness), controller.updateBusiness)
    .delete(controller.deleteBusiness);

// Get detail
routes.route('/:business_id(\\d+)').get(controller.businessDetail);

// List options
routes.route('/get-options').get(controller.getOptions);

// List options
routes.route('/option').get(controller.getOptionV2);

// Change status
// routes
//     .route('/:business_id(\\d+)/change-status')
//     .put(validate(rules.changeStatusBusiness), controller.changeStatusBusiness);

// List options
// routes.route('/get-options-by-area-list').get(controller.getOptionsByAreaList);

// List options
// routes.route('/get-options-by-user').get(controller.getOptionsByUser);

// List options by area id
// routes.route('/get-options-by-area-id').get(controller.getOptionsByAreaId);

module.exports = {
    prefix,
    routes,
};
