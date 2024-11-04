const express = require('express');
const validate = require('express-validation');
const routes = express.Router();
const rules = require('./return-condition.rule');
const returnConditionController = require('./return-condition.controller');
const prefix = '/return-condition';

// List return condition
routes.route('').get(returnConditionController.getListReturnCondition);

// Create new a exchange
routes.route('').post(validate(rules.create), returnConditionController.createExchange);

// Get & update & delete exchange by id
routes
    .route('/:id')
    .get(returnConditionController.getById)
    .put(validate(rules.update), returnConditionController.updateExchange)
    .delete(returnConditionController.deleteExchange);

// Delete list exchanges
routes.route('').delete(returnConditionController.deleteListExchange);

module.exports = {
    prefix,
    routes,
};
