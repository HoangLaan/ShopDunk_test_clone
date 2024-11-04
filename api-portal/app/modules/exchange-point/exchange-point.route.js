const express = require('express');
const validate = require('express-validation');
const rules = require('./exchange-point.rule');
const controller = require('./exchange-point.controller');

const routes = express.Router();

const prefix = '/exchange-point';

// List
routes.route('').get(controller.getListExchangePoint);

//List store
routes.route('/get-store').get(controller.getListStore);

// Detail
routes.route('/:id').get(controller.detailExchangePoint);

//Create
routes.route('').post(validate(rules.create), controller.createExchangePoint);

// Update
routes.route('/:id').put(validate(rules.update), controller.updateExchangePoint);

// Delete
routes.route('').delete(controller.deleteExchangePoint);

module.exports = {
    prefix,
    routes,
};
