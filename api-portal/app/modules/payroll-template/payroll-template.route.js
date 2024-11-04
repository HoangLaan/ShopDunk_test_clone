const express = require('express');
const validate = require('express-validation');
const controller = require('./payroll-template.controller');
const routes = express.Router();
const prefix = '/payroll-template';
const rules = require('./payroll-template.rule');

routes
    .route('')
    .get(controller.getList)
    .post(validate(rules.create), controller.createOrUpdate)
    .patch(validate(rules.update), controller.createOrUpdate)
    .delete(controller.remove);
routes.route('/:template_id(\\d+)').get(controller.detail);
routes.route('/salary-element').get(controller.getSalaryElementList);

module.exports = {
    prefix,
    routes,
};
