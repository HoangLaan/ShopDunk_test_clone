const express = require('express');
const validate = require('express-validation');
const controller = require('./area.controller');
const areaController = require('./area.controller');
const routes = express.Router();
const rules = require('./area.rule');
const prefix = '/area';

// List options area
routes.route('/get-options').get(controller.getOptions);
// List area
routes.route('').get(areaController.getListArea);

// Detail a area
routes.route('/:areaId(\\d+)').get(areaController.detailArea);

// Create new a area
routes.route('').post(validate(rules.createArea), areaController.createArea);

// Update a area
routes.route('/:areaId(\\d+)').put(validate(rules.updateArea), areaController.updateArea);

// Change status a area
routes.route('/:areaId/change-status').put(validate(rules.changeStatusArea), areaController.changeStatusArea);

// Delete a area
routes.route('/:areaId(\\d+)').delete(areaController.deleteArea);
// Delete a area
routes.route('/').delete(areaController.deleteListArea);

module.exports = {
    prefix,
    routes,
};
