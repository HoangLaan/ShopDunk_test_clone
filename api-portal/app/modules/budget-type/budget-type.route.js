const express = require('express');
const controller = require('./budget-type.controller');
const validate = require('express-validation');
const rules = require('./budget-type.rule');
const routes = express.Router();
const prefix = '/budget-type';


routes.route('').post(validate(rules.createBudgetType),controller.createBudgetType);

routes.route('').get(controller.getListBudgetType);

routes.route('/:id(\\d+)')
  .get(controller.getById)
  .put(validate(rules.updateBudgetType),controller.updateBudgetType)
  .delete(controller.deleteBudgetType)

// Delete list budget type
routes.route('').delete(controller.deleteListBudgetType);





module.exports = {
  prefix,
  routes,
};
