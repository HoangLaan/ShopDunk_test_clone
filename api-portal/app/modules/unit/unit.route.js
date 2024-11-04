const express = require('express');
const unitController = require('./unit.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./unit.rule');
const prefix = '/unit';

// List options unit
routes.route('/get-options')
  .get(unitController.getOptions);

// List unit
routes.route('')
  .get(unitController.getListUnit); 

// Create new a unit
routes.route('')
  .post(validate(rules.createUnit),unitController.createUnit);

// Change status a unit
routes.route('/:unitId(\\d+)/change-status')
  .put(validate(rules.changeStatusUnit),unitController.changeStatusUnit);

// Update a unit
routes.route('/:unitId(\\d+)')
  .put(validate(rules.updateUnit),unitController.updateUnit);

// Delete a unit
routes.route('/:unitId(\\d+)')
  .delete(unitController.deleteUnit);

// Detail a unit
routes.route('/:unitId(\\d+)')
  .get(unitController.detailUnit);

module.exports = {
  prefix,
  routes,
};
