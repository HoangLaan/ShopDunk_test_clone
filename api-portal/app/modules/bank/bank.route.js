const express = require('express');
const controller = require('./bank.controller');
const routes = express.Router();
const validate = require('express-validation');
const prefix = '/bank';
const rules = require('./bank.rule');

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getBankList)
    .post(validate(rules.create), controller.createBank)
    .put(validate(rules.update), controller.updateBank)
    .delete(controller.deleteBank);

// Get detail
routes.route('/:bank_id(\\d+)').get(controller.bankDetail);

routes.route('/get-options').get(controller.getOptions);

routes.route('/get-options-by-company').get(controller.getOptionsByCompany);

module.exports = {
    prefix,
    routes,
};
