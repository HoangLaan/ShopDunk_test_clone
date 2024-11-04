const express = require('express');
const validate = require('express-validation');
const levelController = require('./level.controller');
const routes = express.Router();
const rules = require('./level.rule');
const prefix = '/skilllevel';
// List
routes.route('')
  .get(levelController.getListLevel);

// // Detail 
routes.route('/:level_id(\\d+)')
  .get(levelController.detailLevel);

// // Create 
routes.route('')
.post(validate(rules.createLevel),levelController.createLevel);

// // Update
routes.route('/:level_id(\\d+)')
  .put(validate(rules.createLevel),levelController.updateLevel);

// Delete
routes.route('/:level_id(\\d+)')
  .delete(levelController.deleteLevel);

  // opts
routes.route('/get-options')
.get(levelController.getOptions);

module.exports = {
  prefix,
  routes,
};
