const express = require('express');
const validate = require('express-validation');
const rules = require('./hr-salary.rule');
const controller = require('./hr-salary.controller');
const routes = express.Router();
const prefix = '/hr-salary';

routes
    .route('')
    .get(controller.getListHrSalary)
    .post(validate(rules.create), controller.createOrUpdateHrSalary)
    .put(validate(rules.update), controller.createOrUpdateHrSalary)
    .delete(controller.delHrSalary);

routes.route('/:id(\\d+)/detail').get(controller.getHrSalaryById);

module.exports = {
    prefix,
    routes,
};
