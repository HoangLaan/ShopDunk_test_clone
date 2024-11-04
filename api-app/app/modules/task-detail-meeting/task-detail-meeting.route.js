const express = require('express');
const validate = require('express-validation');
const taskDetailController = require('./task-detail-meeting.controller');
const routes = express.Router();
const rules = require('./task-detail-meeting.rule');
const prefix = '/task-detail-meeting';

// Get list, update lịch hẹn
routes.route('').get(taskDetailController.getList).patch(validate(rules.updateMeeting), taskDetailController.update);

// Get chi tiết lịch hẹn
routes.route('/detail/:meeting_id(\\d+)').get(validate(rules.getDetail), taskDetailController.detail);

// Get trạng thái chăm sóc
routes.route('/task-work-flow').get(validate(rules.getTaskWorkFlow), taskDetailController.getListTaskWorkFlow);

// List sản phẩm
routes.route('/products').get(taskDetailController.getProductOptions);

module.exports = {
    prefix,
    routes,
};
