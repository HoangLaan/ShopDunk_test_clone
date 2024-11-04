const express = require('express');
const validate = require('express-validation');
const rules = require("./date-confirm-time-keeping.rule");
const timeKeepingDateConfrimController = require("./date-confirm-time-keeping.controller");
const routes = express.Router();
const prefix = '/date-confirm-time-keeping';

// List
routes.route('').get(timeKeepingDateConfrimController.getListTimeKeepingDateConfirm);

routes.route('/check-date-confirm').get(timeKeepingDateConfrimController.CheckTimeKeepingDateConfirm);
// create or update
routes.route('').post(validate(rules.createTimeKeepingDateConfirm), timeKeepingDateConfrimController.timeKeepingDateConfirmCreateOrUpdate);

routes.route('/').delete(timeKeepingDateConfrimController.deleteTimeKeepingDateConfirmList);

routes.route('/:time_keeping_confirm_date_id(\\d+)').get(timeKeepingDateConfrimController.getOptionTimeKeepingDateConfirm)

routes.route('/:time_keeping_confirm_date_id(\\d+)').delete(timeKeepingDateConfrimController.deleteTimeKeepingDateConfirm);

routes.route('/:time_keeping_confirm_date_id(\\d+)').put(timeKeepingDateConfrimController.UpdateTimeKeepingDateConfirm);

// Get list month apply time keeping confirm date
routes.route('/get-month-option').get(timeKeepingDateConfrimController.getMonthApplyTimeKeeping);
//getMonthApplyTimeKeeping
module.exports= {
    prefix,
    routes,
}
