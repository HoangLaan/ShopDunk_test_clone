const express = require('express');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const timekeepingController = require('./timekeeping.controller');
const routes = express.Router();
const rules = require('./timekeeping.rule');
const prefix = '/timekeeping';

// Get shift info
routes.route('/shift-info').get(schemaMiddleWare(rules.global), timekeepingController.getShiftInfo);

// Check in or check out
routes.route('/checkinout').post(schemaMiddleWare(rules.checkInOrCheckOut), timekeepingController.checkInOrCheckOut);

routes
    .route('/statitics')
    .get(schemaMiddleWare(rules.getStatiticsTimeKeeping), timekeepingController.getStatiticsTimeKeeping);

// Get list timekeeping
routes.route('/').get(schemaMiddleWare(rules.getListTimeKeeping), timekeepingController.getListTimeKeeping);

module.exports = {
    prefix,
    routes,
};
