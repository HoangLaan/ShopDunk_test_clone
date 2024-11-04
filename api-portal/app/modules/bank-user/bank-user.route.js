const express = require('express');
const validate = require('express-validation');
const rules = require('./bank-user.rule');
const bankUserController = require('./bank-user.controller');
const routes = express.Router();
const prefix = '/bank-user';

routes.route('')
  .get(bankUserController.getList)
  .post(validate(rules.create), bankUserController.createOrUpdate)
  .delete(bankUserController.delete);

routes.route('/export-excel').post(bankUserController.exportExcel);
routes.route('/template-import').post(bankUserController.getTemplateImport);
routes.route('/import-excel').post(bankUserController.importExcel);

routes.route('/:id')
  .get(bankUserController.getById)
  .put(validate(rules.update), bankUserController.createOrUpdate);


module.exports = {
  prefix,
  routes,
};
