const express = require('express');
const validate = require('express-validation');
const rules = require('./usergroup-function.rule');
const userGroupFunctionController = require('./usergroup-function.controller');
const routes = express.Router();
const prefix = '/usergroup-function';


// Create new a userGroup function
routes.route('')
  .post(validate(rules.createUserGroupFunction),userGroupFunctionController.createUserGroupFunction);
routes.route('/get-list-function-groups')
  .get(userGroupFunctionController.getListFunctionGroup);
routes.route('/get-list-functions-by-function-group/:functionGroupId(\\d+)')
  .get(userGroupFunctionController.getListFunctionByFunctionGroupID);
module.exports = {
  prefix,
  routes,
};
