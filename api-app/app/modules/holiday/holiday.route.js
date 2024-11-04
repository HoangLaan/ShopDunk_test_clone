const express = require('express');
const validate = require('express-validation');
const rules = require("./holiday.rule");
const HolidayController = require("./holiday.controller");
const routes = express.Router();
const prefix = '/holiday';

// List
routes.route('').get(HolidayController.getListHoliday);

// create or update

routes.route('').post(validate(rules.createHoliday), HolidayController.HolidayCreateOrUpdate);

routes.route('/:holiday_id(\\d+)').get(HolidayController.getHoliday)


routes.route('/:holiday_id(\\d+)').delete(HolidayController.deleteHoliday);

routes.route('/user/:member_id(\\d+)').delete(HolidayController.deleteHoliday);


module.exports = {
    prefix,
    routes,
}