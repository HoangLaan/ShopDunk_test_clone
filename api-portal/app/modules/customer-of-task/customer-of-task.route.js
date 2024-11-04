const express = require('express');
const validate = require('express-validation');
const CustomerOfTaskController = require('./customer-of-task.controller');
const routes = express.Router();
const rules = require('./customer-of-task.rule');
const prefix = '/customer-of-task';

// Get list 
routes
    .route('')
    .get(CustomerOfTaskController.getCustomerOfTaskList)
    .post(validate(rules.create), CustomerOfTaskController.createCustomerOfTask)
    .put(validate(rules.create), CustomerOfTaskController.createCustomerOfTask);
// Get detail
routes.route('/:task_detail_id(\\d+)').get(CustomerOfTaskController.detailCustomerOfTask);
// Get options
routes.route('/source/get-options').get(CustomerOfTaskController.getOptionsSource);
routes.route('/store/get-options').get(CustomerOfTaskController.getOptionsStore);
routes.route('/customer-type/get-options').get(CustomerOfTaskController.getOptionsCustomerType);
routes.route('/task-type/get-options').get(CustomerOfTaskController.getOptionsTaskType);
routes.route('/task-work-flow/get-options').get(CustomerOfTaskController.getOptionsTaskWorkFlow);
routes.route('/task/get-options').get(CustomerOfTaskController.getOptionsTask);
routes.route('/get-config').get(CustomerOfTaskController.getConfig);
routes.route('/task-work-flow').get(CustomerOfTaskController.getTaskWorkFlow);
routes.route('/export-excel').post(CustomerOfTaskController.exportExcel)

module.exports = {
    prefix,
    routes,
};