const express = require('express');
const validate = require('express-validation');
const rules = require('./announce-type.rule');
const announceTypeController = require('./announce-type.controller');
const routes = express.Router();
const prefix = '/announce-type';

routes.route('/get-company-options')
  .get(announceTypeController.getCompanyOptions);

routes.route('/get-department-options')
  .get(announceTypeController.getDepartmentOptions)

module.exports = {
    prefix,
    routes,
  };