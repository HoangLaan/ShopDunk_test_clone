const express = require('express');
const lockShiftController = require('./lockshift-open.controller');
const routes = express.Router();

const prefix = '/lock-shift-open';

// List
routes.route('').get(lockShiftController.getListLockShiftOpen)
  .post(lockShiftController.createOrUpdateLockShiftOpen);

// check is allow open shift && is has permission 
routes.route('/check').get(lockShiftController.checkIsAllowOpenShift)


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

module.exports = {
  prefix,
  routes,
};
