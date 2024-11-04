const express = require('express');
const validate = require('express-validation');
const controller = require('./lockshift-close.controller');
const routes = express.Router();
const rules = require('./lockshift-close.rule');
const prefix = '/lockshift-close/';

// Get list, create, update lockshift close
routes
    .route('')
    .get(controller.getListLockshift)
    .post(validate(rules.createAll), controller.createLockshiftAll)
    .put(validate(rules.updateAll), controller.updateLockshiftAll);

// Get detail and lockshift cash
routes.route('/:lockshift_id(\\d+)').get(controller.detailLockshift);

// Get statistics
routes.route('/statistics/:lockshift_id(\\d+)').get(controller.statisticsLockshift);

// get list lockshift product
routes.route('/product/:lockshift_id(\\d+)').get(controller.getListLockshiftProducts);

// get list lockshift customer
routes.route('/customer/:lockshift_id(\\d+)').get(controller.getListLockshiftCustomer);

// get list lockshift equipment
routes.route('/equipment/:lockshift_id(\\d+)').get(controller.getListLockshiftEquipment);

// check user have shift
routes.route('/check-have-shift').get(controller.checkValidShift);

// get product inventory
routes.route('/products-inventory').put(validate(rules.getProductInventory), controller.getProductInventory);

// Get list product
routes.route('/products').get(controller.getListProducts);

// Get list equipments
routes.route('/equipments').get(controller.getListEquipment);

// Get current shift
routes.route('/current-shift').get(controller.getCurrentShift);

module.exports = {
    prefix,
    routes,
};
