const express = require('express');
const validate = require('express-validation');
const degreeController = require('./degree.controller');
const routes = express.Router();
const rules = require('./degree.rule');
const prefix = '/degree';


// List
routes.route('')
  .get(degreeController.getListDegree);

// // Detail 
routes.route('/:degree_id(\\d+)')
  .get(degreeController.detailDegree);

// // Create 
routes.route('')
  .post(validate(rules.createDegree), degreeController.createDegree);

// // Update
routes.route('/:degree_id(\\d+)')
  .put(validate(rules.createDegree), degreeController.updateDegree);

// Delete
routes.route('/delete')
  .post(degreeController.deleteDegree);

module.exports = {
  prefix,
  routes,
};
