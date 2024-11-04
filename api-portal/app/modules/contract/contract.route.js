const express = require('express');
const validate = require('express-validation');
const controller = require('./contract.controller');
const routes = express.Router();
const rules = require('./contract.rule');
const multer = require('multer');
const upload = multer();
const prefix = '/contract';

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getContractList)
    .post(upload.single('attachment'), validate(rules.create), controller.createContract)
    .put(upload.single('attachment'), validate(rules.update), controller.updateContract)
    .delete(controller.deleteContract);

// Get detail
routes.route('/:contract_id(\\d+)').get(controller.contractDetail);

// Download attachment
routes.route('/download-attachment/:contract_id(\\d+)').get(controller.downloadAttachment);

// List options
routes.route('/get-options').get(controller.getOptions);

module.exports = {
    prefix,
    routes,
};
