const express = require('express');
const validate = require('express-validation');
const timeKeepingController = require('./time-keeping.controller');
const routes = express.Router();
const rules = require('./time-keeping.rule');
const prefix = '/time-keeping';
routes
    .route('')
    .get(timeKeepingController.getListUser)
    .post(validate(rules.createOrUpdateSchedule), timeKeepingController.createOrUpdateSchedule);
routes
    .route('/create-time-keeping')
    .post(validate(rules.createOrUpdateTimeKeeping), timeKeepingController.createOrUpdateTimeKeeping);

routes.route('/time-keeping-list').post(timeKeepingController.createOrUpdateTimeKeepingList);
routes.route('/option').get(timeKeepingController.getListOption);
routes.route('/:timeKeeping_id').put(timeKeepingController.deleteSchedule);
routes.route('/check-permission').get(timeKeepingController.checkPerMission);
routes.route('/get-list-timekeeping-by-user').get(timeKeepingController.getListTimeKeepingByUser);
routes.route('/export-excel').post(timeKeepingController.exportExcel);
routes.route('/export-excel-time-keeping').post(timeKeepingController.exportExcelTimeKeeping);

routes.route('/shift-qc').get(timeKeepingController.getListShiftQC);
routes.route('/shift-broken-shift').get(timeKeepingController.getListBrokenShift);

module.exports = {
    prefix,
    routes,
};