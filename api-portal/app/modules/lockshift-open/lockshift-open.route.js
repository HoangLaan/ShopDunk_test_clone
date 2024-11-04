const express = require('express');
const lockShiftController = require('./lockshift-open.controller');
const routes = express.Router();

const prefix = '/lock-shift-open';

// List
routes.route('').get(lockShiftController.getListLockShiftOpen)
  .post(lockShiftController.createOrUpdateLockShiftOpen);

// check is allow open shift
routes.route('/check').get(lockShiftController.checkIsAllowOpenShift)

// check is shift leader 
routes.route('/check-permission').get(lockShiftController.checkHasPermission)

// Get detail
routes.route('/info').get(lockShiftController.detailLockShift);

// Get statistics
routes.route('/statistics').get(lockShiftController.statisticsLockShift);

// Get list cash
routes.route('/cash').get(lockShiftController.getListLockShiftCash)

// Get list equipment
routes.route('/equipment').get(lockShiftController.getListLockShiftEquipment)

// Get list product
routes.route('/product').get(lockShiftController.getListLockShiftProduct)

// Get list customer
routes.route('/customer').get(lockShiftController.getListLockShiftCustomer)

//delte product in lockshift 
routes.route('/delete-product/:id').delete(lockShiftController.deleteProductInShift)

module.exports = {
  prefix,
  routes,
};
