const express = require('express');
const OffWorkTypeController = require('./offwork-type.controller');
const routes = express.Router();
const prefix = '/off-work-type';

// Get user review offwork type 
routes.route('/:off_work_type_id(\\d+)/review-level-user')
  .get(OffWorkTypeController.getListOffWorkRlUser);

// Get offwork type option 
routes.route('/get-options')
  .get(OffWorkTypeController.getOptions);

module.exports = {
  prefix,
  routes,
};
