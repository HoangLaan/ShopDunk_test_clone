const express = require('express');
const validate = require('express-validation');
const controller = require('./denomination.controller');
const routes = express.Router();
const prefix = '/denomination';
const rules = require('./denomination.rule');

// Get list, create. update, delete
routes
    .route('')
    // .get(controller.getDenominationList)
    .post(validate(rules.create), controller.createDenomination)
    .put(validate(rules.update), controller.updateDenomination)
    .delete(controller.deleteDenomination);

// Get detail
routes.route('/:denomination_id(\\d+)').get(controller.denominationDetail);

module.exports = {
    prefix,
    routes,
};
