const express = require('express');
const validate = require('express-validation');
const offWorkManagementController = require('./offwork-management.controller');
const routes = express.Router();
const rules = require('./offwork-management.rule');
const prefix = '/off-work-management';

// Get list, Create
routes.route('')
    .get(offWorkManagementController.getList)
    .post(offWorkManagementController.createOrUpdate);

routes.route('/get-department-options')
    .get(offWorkManagementController.getDepartmentByBlock)  
    
    
// Detail a policy
routes.route('/:id').get(offWorkManagementController.getDetail);

//delete policy
routes.route('/:id').delete(offWorkManagementController.deletePolicy);


module.exports = {
    prefix,
    routes,
};
