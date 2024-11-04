const express = require('express');
const validate = require('express-validation');
const controller = require('./task.controller');
const routes = express.Router();
const rules = require('./task.rule');
const prefix = '/task';

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getTaskList)
    .post(validate(rules.create), controller.createTask)
    .put(validate(rules.update), controller.updateTask)
    .delete(controller.deleteTask);

// Get detail
routes.route('/:task_id(\\d+)').get(controller.taskDetail);

// Get care detail
routes.route('/care/:task_detail_id(\\d+)').get(controller.taskCareDetail);

// Create care comment
routes.route('/care/comment').post(validate(rules.createCareComment), controller.createCareComment);

// Create care comment
routes.route('/care/interest-content').post(validate(rules.updateInterestContent), controller.updateInterestContent);

// Get care comment list
routes.route('/care/comment').get(controller.getCareCommentList);

routes.route('/care/product').get(controller.getCareProductList);

// Change work flow
routes.route('/care/change-work-flow').post(validate(rules.changeWorkFlow), controller.changeWorkFlow);

// Get care history list
routes.route('/care/history/:task_detail_id(\\d+)').get(controller.getCareHistoryList);

// List options
routes.route('/get-options').get(controller.getOptions);

// Task type options
routes.route('/task-type/get-options').get(controller.getTaskTypeOptions);

// Store options by company
routes.route('/store/get-options').get(controller.getStoreOptionsByCompany);

// Department options by company
routes.route('/department/get-options').get(controller.getDepartmentOptionsByCompany);

// User options by department, store
routes.route('/user/get-options').get(controller.getUserOptionsByDepartmentStore);

// Product options
routes.route('/product/get-options').get(controller.getProductOptions);

// Member list
routes.route('/member').get(controller.getMemberList);

// SMS
routes.route('/care/sms').post(validate(rules.createSMSCustomer), controller.createSMSCustomer);

// Update SMS status webhook
routes.route('/care/sms/update-status').get(controller.updateSMSStatus);

// Call
routes.route('/care/call').post(validate(rules.createCallCustomer), controller.createCallCustomer);

// Meeting
routes.route('/care/meeting').post(validate(rules.createMeetingCustomer), controller.createMeetingCustomer);

// List customer by taskid
routes.route('/customer').get(controller.getCustomerList);

routes.route('/customer-by-user').get(controller.getCustomerListByUser);

// Brandname options
routes.route('/brandname/get-options').get(controller.getBrandnameOptions);

// Sms template options
routes.route('/sms-template/get-options').get(controller.getSmsTemplateOptions);

// Task type auto options
routes.route('/task-type-auto/get-options').get(controller.getTaskTypeAutoOptions);

// Get detail with voip
routes.route('/voip').get(controller.getTaskWithVoip);

module.exports = {
    prefix,
    routes,
};
