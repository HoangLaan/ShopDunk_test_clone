const express = require('express');
const validate = require('express-validation');
const controller = require('./block.controller');
const routes = express.Router();
const prefix = '/block';
const rules = require('./block.rule');

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getBlockList)
    .post(validate(rules.create), controller.createBlock)
    .put(validate(rules.update), controller.updateBlock)
    .delete(controller.deleteBlock);

// Get detail
routes.route('/:block_id(\\d+)').get(controller.blockDetail);

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
