const express = require('express');
const validate = require('express-validation');
const rules = require('./am-businesstype.rule');
const amBusinessTypeController = require('./am-businesstype.controller');
const routes = express.Router();
const prefix = '/business-type';

// List am-businesstype
routes.route('')
  .get(amBusinessTypeController.getListAMBusinessType);

// Create new a am-businesstype
routes.route('')
  .post(validate(rules.createAMBusinessType), amBusinessTypeController.createAMBusinessType);

// Change status a am-businesstype
routes.route('/:business_type_id(\\d+)/change-status')
  .put(validate(rules.changeStatusAMBusinessType), amBusinessTypeController.changeStatusAMBusinessType);

// Update a am-businesstype
routes.route('/:business_type_id(\\d+)')
  .put(validate(rules.updateAMBusinessType), amBusinessTypeController.updateAMBusinessType);

// Delete a am-businesstype
routes.route('/:business_type_id(\\d+)')
  .delete(amBusinessTypeController.deleteAMBusinessType);

// Detail a am-businesstype
routes.route('/:business_type_id(\\d+)')
  .get(amBusinessTypeController.detailAMBusinessType);


// List options am-businesstype
routes.route('/get-options')
  .get(amBusinessTypeController.getOptions);

module.exports = {
  prefix,
  routes,
};
