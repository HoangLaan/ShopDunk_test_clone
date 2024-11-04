const express = require('express');
const validate = require('express-validation');
const rules = require('./zalo-template.rule');
const zaloTemplateController = require('./zalo-template.controller');
const routes = express.Router();
const prefix = '/zalo-template';

routes
  .route('')
  .get(zaloTemplateController.getList)
  .post(validate(rules.create), zaloTemplateController.createOrUpdate)
  .put(validate(rules.update), zaloTemplateController.createOrUpdate)
  .delete(zaloTemplateController.delete)

routes.route('/history').get(zaloTemplateController.getListHistory)

routes.route('/:id').get(zaloTemplateController.getById);

module.exports = {
  prefix,
  routes,
};
