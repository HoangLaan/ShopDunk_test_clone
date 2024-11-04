const express = require('express');
const validate = require('express-validation');
const controller = require('./receive-type.controller');
const routes = express.Router();
const rules = require('./receive-type.rule');
const prefix = '/receive-type';

routes
    .route('')
    .get(controller.getListReceiveType)
    .post(validate(rules.createReceiveType), controller.createReceiveType)
    .delete(controller.deleteReceiveType);
    
routes.route('/tree').get(controller.getTree);

routes.route('/:receive_type_id(\\d+)').put(validate(rules.updateReceiveType), controller.updateReceiveType);

// Detail a area
routes.route('/:receive_type_id(\\d+)').get(controller.detailReceiveType);

routes.route('/get-options').get(controller.getReceiveTypeOptions);

routes.route('/get-company-options').get(controller.getCompanyOptions);

routes.route('/get-business-options').get(controller.getBusinessOptions);

routes.route('/bank-account').get(controller.getListBankAccount);

module.exports = {
    prefix,
    routes,
};
