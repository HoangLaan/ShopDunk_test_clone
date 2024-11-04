const express = require('express');
const validate = require('express-validation');
const departmentController = require('./department.controller');
const routes = express.Router();
const rules = require('./department.rule');
const prefix = '/department';
// List
routes.route('').get(departmentController.getListDepartment);

// Detail
routes.route('/:department_id(\\d+)').get(departmentController.detailDepartment);

// Create
routes.route('').post(validate(rules.createDepartment), departmentController.createDepartment);

// Update
routes.route('/:department_id(\\d+)').put(validate(rules.updateDepartment), departmentController.updateDepartment);

// Change status
routes
    .route('/:department_id/change-status')
    .put(validate(rules.changeStatusDepartment), departmentController.changeStatusDepartment);

// Delete
routes.route('/:department_id(\\d+)').delete(departmentController.deleteDepartment);

// List options department
routes.route('/get-options').get(departmentController.getOptions);

// get department by company
routes.route('/get-department-by-company').get(departmentController.getDepartmentByCompany);

// get by bussinessid & departmentid
routes
    .route('/get-user/bussiness/:bussiness_id/deparment/:department_id')
    .get(departmentController.getOptionsUserByDepartment);

module.exports = {
    prefix,
    routes,
};
