const express = require('express');
const validate = require('express-validation');
const rules = require('./usergroup.rule');
const userGroupController = require('./usergroup.controller');
const routes = express.Router();
const prefix = '/usergroup';

// List userGroup
routes.route('')
  .get(userGroupController.getListUserGroup);

// Create new a userGroup
routes.route('')
  .post(validate(rules.createUserGroup), userGroupController.createUserGroup);

// Update a userGroup
routes.route('/:userGroupId(\\d+)')
  .put(validate(rules.updateUserGroup), userGroupController.updateUserGroup);

// Detail a userGroup
routes.route('/:userGroupId(\\d+)')
  .get(userGroupController.detailUserGroup);

// List options
routes.route('/get-options')
  .get(userGroupController.getOptions);

// Delete many userGroup
routes.route('/delete')
  .post(validate(rules.deleteUserGroup), userGroupController.deleteUserGroup);


module.exports = {
  prefix,
  routes,
};
