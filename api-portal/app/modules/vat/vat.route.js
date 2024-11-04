const express = require('express');
const vatController = require('./vat.controller');
const routes = express.Router();
const prefix = '/vat';
const rules = require('./vat.rule');
const validate = require('express-validation');

// List options am-company
routes.route('/get-options').get(vatController.getOptions);
// List VAT
routes.route('').get(vatController.getListVat);
// Create new a VAT
routes
    .route('')
    .patch(validate(rules.updateVat), vatController.createOrUpdateVat)
    .post(validate(rules.createVat), vatController.createOrUpdateVat);
// Detail a VAT
routes.route('/:vatId(\\d+)').get(vatController.detailVat);
// Delete a VAT
routes.route('/:vatId(\\d+)').delete(vatController.deleteVat);
module.exports = {
    prefix,
    routes,
};
