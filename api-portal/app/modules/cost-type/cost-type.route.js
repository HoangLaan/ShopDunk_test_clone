const express = require('express');
const validate = require('express-validation');
const CostTypeController = require('./cost-type.controller');
const routes = express.Router();
const rules = require('./cost-type.rule');
const prefix = '/cost-type';

routes.route('').get(CostTypeController.getList)

// List options 
routes.route('/get-options').get(CostTypeController.getOptions);

// Detail cost type
routes.route('/:costTypeId(\\d+)').get(CostTypeController.detailCostType);

// Create cost type
routes.route('').post(validate(rules.createCostType), CostTypeController.createCostType);

// Update cost type
routes.route('/:costTypeId(\\d+)').put(validate(rules.updateCostType), CostTypeController.updateCostType);

// Delete cost type 
routes.route('/delete').post(CostTypeController.deleteCostTypes);

module.exports = {
  prefix,
  routes,
};
