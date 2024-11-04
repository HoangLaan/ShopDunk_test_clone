const express = require('express');
const validate = require('express-validation');
const hobbiesController = require('./hobbies.controller');
const routes = express.Router();
const rules = require('./hobbies.rule');
const prefix = '/hobbies';

routes.route('')
  .get(hobbiesController.getList)
  .post(validate(rules.create), hobbiesController.createOrUpdate);

module.exports = {
    prefix,
    routes,
};
