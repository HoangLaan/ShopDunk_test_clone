const express = require('express');
const controller = require('./borrow-type.controller');
const validate = require('express-validation');
const rules = require('./borrow-type.rule');
const routes = express.Router();
const prefix = '/borrow-type';


routes.route('').post(validate(rules.createBorrowType),controller.createBorrowType);

routes.route('').get(controller.getListBorrowType);

routes.route('/:id')
  .get(controller.getById)
  .put(validate(rules.updateBorrowType),controller.updateBorrowType)
  .delete(controller.deleteBorrowType)

// Delete list borrow type
routes.route('').delete(controller.deleteListBorrowType);


module.exports = {
  prefix,
  routes,
};
