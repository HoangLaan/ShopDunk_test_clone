const express = require('express');
const validate = require('express-validation');
const rules = require('./business-type.rule');
const controller = require('./business-type.controller');
const routes = express.Router();
const prefix = '/business-type';

// List options am-businesstype
routes.route('/get-options').get(controller.getOptions);

// List business type
routes.route('').get(controller.getListBusinessType)

// Create new a business type
routes.route('').post(validate(rules.createAMBusinessType), controller.createBusinessType);

// Get & update & delete business type by id
routes.route('/:id')
  .get(controller.getBusinessTypeById)
  .put(validate(rules.updateAMBusinessType), controller.updateBusinessType)
  .delete(controller.deleteBusinessType)

// Delete list business type
routes.route('').delete(controller.deleteListBusinessType);


module.exports = {
    prefix,
    routes,
};
