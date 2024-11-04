const express = require('express');
const validate = require('express-validation');
const rules = require('./interest-content.rule');
const interestContentController = require('./interest-content.controller');
const routes = express.Router();
const prefix = '/interest-content';

routes
  .route('')
  .get(interestContentController.getList)
  .post(validate(rules.create), interestContentController.createOrUpdate)
  .put(validate(rules.update), interestContentController.createOrUpdate)
  .delete(interestContentController.delete);

routes.route('/:id').get(interestContentController.getById);

module.exports = {
  prefix,
  routes,
};
