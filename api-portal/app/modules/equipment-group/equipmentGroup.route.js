const express = require('express');
const validate = require('express-validation');
const rules = require('./equipmentGroup.rule');
const equipmentGroupController = require('./equipmentGroup.controller');

const routes = express.Router();

const prefix = '/equipment-group';

// List Task Work Flow
routes
    .route('')
    .get(equipmentGroupController.getListEquipmentGroup)
    .post(validate(rules.create), equipmentGroupController.createEquipmentGroup)
    .delete(equipmentGroupController.deleteEquipmentGroup);

// Update a Task Work Flow
routes.route('/:id(\\d+)').put(validate(rules.update), equipmentGroupController.updateEquipmentGroup);

// Detail a Task Work Flow
routes.route('/:id(\\d+)').get(equipmentGroupController.detailEquipmentGroup);

// List options
routes.route('/group-options').get(equipmentGroupController.getOptionsEquipmentGroup);

module.exports = {
    prefix,
    routes,
};
