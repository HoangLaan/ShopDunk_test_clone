const express = require('express');
const controller = require('./material-group.controller');
const validate = require('express-validation');
const rules = require('./material-group.rule');
const routes = express.Router();
const prefix = '/material-group';


routes.route('').post(validate(rules.createMaterialGroup), controller.createMaterialGroup);

routes.route('').get(controller.getListMaterialGroup);

routes.route('/:id(\\d+)')
  .get(controller.getById)
  .put(validate(rules.updateMaterialGroup), controller.updateMaterialGroup)
  .delete(controller.deleteMaterialGroup)

// Delete list material group
routes.route('').delete(controller.deleteListMaterialGroup);

// Get options  for create
routes.route('/get-options-tree').get(controller.getOptionTreeView);

// Get options  for create
routes.route('/generate-code').get(controller.generateCode);

module.exports = {
  prefix,
  routes,
};
