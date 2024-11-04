const express = require('express');
const validate = require('express-validation');
const rules = require('./stocks-take-type.rule');
const stocksTakeTypeController = require('./stocks-take-type.controller');
const routes = express.Router();
const prefix = '/stocks-take-type';

routes.route('/get-options').get(stocksTakeTypeController.getOptions);

// List stocksTakeType
routes.route('').get(stocksTakeTypeController.getListStocksTakeType);

// Create new a stocksTakeType
routes.route('').post(validate(rules.createStocksTakeType), stocksTakeTypeController.createStocksTakeType);

// Update a stocksTakeType
routes
    .route('/:stocksTakeTypeId(\\d+)')
    .put(validate(rules.updateStocksTakeType), stocksTakeTypeController.updateStocksTakeType);

// Delete a stocksTakeType
routes.route('/delete').post(stocksTakeTypeController.deleteStocksTakeType);

// Detail a stocksTakeType
routes.route('/:stocksTakeTypeId(\\d+)').get(stocksTakeTypeController.detailStocksTakeType);

// Detail a stocksTakeType
routes.route('/for-take-request/:stocksTakeTypeId(\\d+)').get(stocksTakeTypeController.detailStocksTakeTypeForTake);

// // Export excel
// routes.route('/export-excel')
//   .get(stocksTakeTypeController.exportExcel);

//Get options review level
routes.route('/stocks-review-level/get-options').get(stocksTakeTypeController.getOptionsReviewLevel);

//Get options  user review
routes.route('/get-user').get(stocksTakeTypeController.getListUserReview);

module.exports = {
    prefix,
    routes,
};
