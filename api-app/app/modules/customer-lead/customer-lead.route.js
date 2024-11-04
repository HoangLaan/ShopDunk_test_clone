const express = require('express');
const validate = require('express-validation');
const customerLeadController = require('./customer-lead.controller');
const routes = express.Router();
const rules = require('./customer-lead.rule');
const prefix = '/customer-lead';

routes.route('')
  .post(validate(rules.create), customerLeadController.createOrUpdate);

module.exports = {
  prefix,
  routes,
};