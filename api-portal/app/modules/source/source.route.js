const express = require('express');
const validate = require('express-validation');
const rules = require('./source.rule');
const sourceController = require('./source.controller');

const routes = express.Router();

const prefix = '/source';

// List source
routes.route('').get(sourceController.getListSource);

// Create new a source
routes.route('').post(validate(rules.create), sourceController.createSource);

// List options business
routes.route('/get-options').get(sourceController.getOptions);

// Update a source
routes.route('/:id').put(validate(rules.update), sourceController.updateSource);

// Delete a source
routes.route('').delete(sourceController.deleteSource);

// Detail a source
routes.route('/:id').get(sourceController.detailSource);

module.exports = {
    prefix,
    routes,
};
