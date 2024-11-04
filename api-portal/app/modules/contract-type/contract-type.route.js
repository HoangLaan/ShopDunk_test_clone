const express = require('express');
const controller = require('./contract-type.controller');
const routes = express.Router();
const prefix = '/contract-type';

// Get detail
routes.route('/:contract_type_id(\\d+)').get(controller.contractTypeDetail);

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
