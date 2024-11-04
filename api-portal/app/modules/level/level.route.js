const express = require('express');
const levelController = require('./level.controller');
const routes = express.Router();
const prefix = '/level';
const rules = require('./level.rule');
const validate = require('express-validation');

// List level
routes.route('').get(levelController.getListLevel);
// Create new a level
routes.route('').post(validate(rules.createLevel), levelController.createLevel);
// Update new a level
routes.route('/:levelId(\\d+)').put(validate(rules.updateLevel), levelController.updateLevel);
// Detail a level
routes.route('/:levelId(\\d+)').get(levelController.detailLevel);
// Delete a level
routes.route('/:levelId(\\d+)').delete(levelController.deleteLevel);
// Options level
routes.route('/get-options').get(levelController.getOptions);

module.exports = {
    prefix,
    routes,
};
