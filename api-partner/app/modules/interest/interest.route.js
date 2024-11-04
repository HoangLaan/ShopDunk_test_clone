const express = require('express');
const validate = require('express-validation');
const interestController = require('./interest.controller');
const routes = express.Router();
const rules = require('./interest.rule');
const prefix = '/interest';

routes.route('/:interestId')
    .get(interestController.createOrUpdate)
    .post(interestController.createOrUpdate);

module.exports = {
    prefix,
    routes,
};
