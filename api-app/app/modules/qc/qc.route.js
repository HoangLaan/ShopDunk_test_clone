const express = require('express');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const qcController = require('./qc.controller');
const routes = express.Router();
const rules = require('./qc.rule');
const prefix = '/qc';

// Get shift info
// routes.route('/shift-info').get(schemaMiddleWare(rules.global), timekeepingController.getShiftInfo);
routes.route('').get(qcController.getListStoreQC)
routes.route('/store-qc-info').get(qcController.getStoreQCInfo)
routes.route('/checkinout-at-store').post(qcController.createOrUpdatestoreQC)
routes.route('/finish-qc').post(qcController.finishQCStore)

module.exports = {
    prefix,
    routes,
};
