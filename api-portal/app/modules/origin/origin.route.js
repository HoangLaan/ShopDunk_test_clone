const express = require('express');
const validate = require('express-validation');
const rules = require('./origin.rule');
const originController = require('./origin.controller');
const routes = express.Router();
const prefix = '/origin';


// List options Origin
routes.route('/get-options')
  .get(originController.getOptions);

// List Origin
routes.route('')
  .get(originController.getListOrigin);

// Create new a Origin
routes.route('')
  .post(validate(rules.createOrigin), originController.createOrigin);

// Change status a Origin
routes.route('/:originId(\\d+)/change-status')
  .put(validate(rules.changeStatusOrigin), originController.changeStatusOrigin);

// Update a Origin
routes.route('/:originId(\\d+)')
  .put(validate(rules.updateOrigin), originController.updateOrigin);

// Delete a Origin
routes.route('/:originId(\\d+)')
  .delete(originController.deleteOrigin);

// Detail a Origin
routes.route('/:originId(\\d+)')
  .get(originController.detailOrigin);



module.exports = {
  prefix,
  routes,
};
