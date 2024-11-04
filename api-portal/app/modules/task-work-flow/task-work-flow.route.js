const express = require('express');
const validate = require('express-validation');
const rules = require('./task-work-flow.rule');
const taskWorkFlowController = require('./task-work-flow.controller');

const routes = express.Router();

const prefix = '/task-work-flow';

// List Task Work Flow
routes.route('').get(taskWorkFlowController.getListTaskWorkFlow);

//Download template Excel
routes.route('/download-excel').get(taskWorkFlowController.downloadExcel);

//Import excel
routes.route('/import-excel').post(taskWorkFlowController.importExcel);
//Export excel
routes.route('/export-excel').get(taskWorkFlowController.exportExcel);

// Create new a Task Work Flow
routes.route('').post(validate(rules.create), taskWorkFlowController.createTaskWorkFlow);

// Update a Task Work Flow
routes.route('/:id').put(validate(rules.update), taskWorkFlowController.updateTaskWorkFlow);

// Delete a Task Work Flow
routes.route('').delete(taskWorkFlowController.deleteTaskWorkFlow);

// Detail a Task Work Flow
routes.route('/:id').get(taskWorkFlowController.detailTaskWorkFlow);

module.exports = {
    prefix,
    routes,
};