const express = require('express');
const validate = require('express-validation');
const rules = require('./user-level.rule');
const userLevelController = require('./user-level.controller');
const routes = express.Router();
const prefix = '/user-level';

routes
    .route('')
    .get(userLevelController.getListUserLevel)
    .post(validate(rules.createUserLevel), userLevelController.createUserLevel)
    .delete(userLevelController.deleteUserLevel);

// List options user level
routes.route('/get-options')
    .get(userLevelController.getOptions);

module.exports = {
    prefix,
    routes,
};
