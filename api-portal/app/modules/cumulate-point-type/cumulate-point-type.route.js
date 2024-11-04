const express = require('express');
const validate = require('express-validation');
const rules = require('./cumulate-point-type.rule');
const controller = require('./cumulate-point-type.controller');

const routes = express.Router();

const prefix = '/cumulate-point-type';

// List
routes.route('').get(controller.getListCumulatePoinType);

//List store
routes.route('/get-store').get(controller.getListStore);

// options
routes.route('/get-options').get(controller.getListOptions);

// options
routes.route('/calculate-point').get(controller.calculatePoint);

// Detail
routes.route('/:id').get(controller.detailCumulatePoinType);

//Create
routes.route('').post(validate(rules.create), controller.createCumulatePoinType);

// Update
routes.route('/:id').put(validate(rules.update), controller.updateCumulatePoinType);

// Delete
routes.route('').delete(controller.deleteCumulatePoinType);

module.exports = {
    prefix,
    routes,
};
