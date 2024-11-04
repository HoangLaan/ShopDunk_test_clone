const express = require('express');
const validate = require('express-validation');
const borrowController = require('./borrow.controller');
const routes = express.Router();
const rules = require('./borrow.rule'); 
const prefix = '/borrow';
// stocks list
routes.route('').get(validate(rules.getListStocks), borrowController.getListStocks);
routes.route('/list-borrow-type').get(borrowController.getListBorrowType);
routes.route('').post( borrowController.createBorrow);

module.exports = {
    prefix,
    routes,
};
