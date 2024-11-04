const express = require('express');
const validate = require('express-validation');
const rules = require('./task-type.rule');
const taskTypeController = require('./task-type.controller');
const routes = express.Router();
const prefix = '/task-type';

routes.route('')
  .get(taskTypeController.getList)
  .post(validate(rules.create), taskTypeController.createOrUpdate)
  .delete(taskTypeController.delete);

routes.route('/get-task-workflow').get(taskTypeController.getTaskWorkflow);
routes.route('/get-user').get(taskTypeController.getListUser);
routes.route('/condition')
  .get(taskTypeController.getListCondition)
  .post(validate(rules.createOrUpdateCondition), taskTypeController.createOrUpdateCondition)

routes.route('/export-excel').post(taskTypeController.exportExcel);
routes.route('/template-import').post(taskTypeController.getTemplateImport);
routes.route('/import-excel').post(taskTypeController.importExcel);

routes.route('/:id')
  .get(taskTypeController.getById)
  .put(validate(rules.update), taskTypeController.createOrUpdate);


module.exports = {
  prefix,
  routes,
};
