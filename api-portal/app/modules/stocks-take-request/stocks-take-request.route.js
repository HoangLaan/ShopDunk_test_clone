const express = require('express');
const rules = require('./stocks-take-request.rule');
const stocksTakeTypeController = require('./stocks-take-request.controller');
const routes = express.Router();
const upload = require('multer')();
const prefix = '/stocks-take-request';
const schemaMiddleWare = require('../../middlewares/schema.middleware');

// List stocksTakeType
routes.get('/', schemaMiddleWare(rules.ruleGetList), stocksTakeTypeController.getListStocksOutType);
routes.get('/stocks-list/store/:store_id', stocksTakeTypeController.getStocksById);
// Generate code
routes.get('/generate-code', stocksTakeTypeController.generateStocksTakeRequestCode);
routes.get('/list-product', stocksTakeTypeController.getListProduct);
routes.get('/:stocks_take_request_id(\\d+)/', stocksTakeTypeController.detailStocksTakeRequest);
routes.route('/:stocks_take_request_id(\\d+)/execute').put(stocksTakeTypeController.executeStocksTakeRequestPeriod);
routes.route('/:stocks_take_request_id(\\d+)/conclude').post(stocksTakeTypeController.updateConcludeContent);

// create stocks code
routes.post('/', schemaMiddleWare(rules.createStocksTakeType), stocksTakeTypeController.createStocksTakeRequest);
// put stocks take code
routes.put('/:stocks_take_request_id', stocksTakeTypeController.createStocksTakeRequest);
// Get user in department
routes.get('/user-of-deparment-options/:department_id(\\d+)/', stocksTakeTypeController.getUserOfDepartmentOpts);
// Get inventory
routes.get('/get-inventory/:stocks_take_request_id(\\d+)/', stocksTakeTypeController.getListProductInventory);

routes.route('/approve-reject').post(stocksTakeTypeController.approveOrRejectUpdateStocksTake);

routes.route('/product-stocks-take/import').post(upload.any(), stocksTakeTypeController.productStocksTakeImport);

// DELETE
routes.route("/:stocks_take_request_id(\\d+)")
    .delete(stocksTakeTypeController.deleteStocksTakeRequestPeriod)

module.exports = {
    prefix,
    routes,
};
