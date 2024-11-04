const express = require('express');
const validate = require('express-validation');
const ULHistoryController = require('./user-level-history.controller');
const routes = express.Router();
const rules = require('./user-level-history.rule');
const prefix = '/user-level-history';

// List user level history
routes.route('')
    .get(ULHistoryController.getListULHistory);

// Detail a user level history
routes.route('/:ulhistoryId(\\d+)')
    .get(ULHistoryController.detailULHistory);

// Create new a user level history
routes.route('')
    .post(validate(rules.createULHistory), ULHistoryController.createULHistory);

// Update a user level history
routes.route('/:ulhistoryId(\\d+)')
    .put(validate(rules.updateULHistory), ULHistoryController.updateULHistory);

// Delete a user level history
routes.route('/delete')
    .delete(validate(rules.deleteULHistory), ULHistoryController.deleteULHistory);

// Get list user options with search 
routes.route('/users/get-options')
    .get(ULHistoryController.getUserOptions)

// Get detail user 
routes.route('/users/:username')
    .get(ULHistoryController.detailUser)

module.exports = {
    prefix,
    routes,
};
