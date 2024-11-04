const express = require('express');
const validate = require('express-validation');
const rules = require('./position-level.rule');
const positionLevelController = require('./position-level.controller');
const routes = express.Router();
const prefix = '/position-level';

routes
    .route('')
    .get(positionLevelController.getListPositionLevel)
    .post(validate(rules.createPositionLevel), positionLevelController.createPositionLevel)
    .patch(validate(rules.updatePositionLevel), positionLevelController.updatePositionLevel)
    .delete(positionLevelController.deletePositionLevel);

routes.route('/:id(\\d+)').get(positionLevelController.detailPositionLevel);

routes.route('/get-options').get(positionLevelController.getOptions);

// List options position by postion id
routes.route('/get-options-by-position').get(positionLevelController.getOptionsByPositionId);

module.exports = {
    prefix,
    routes,
};
