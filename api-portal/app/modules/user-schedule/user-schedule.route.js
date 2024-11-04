const express = require('express');
const validate = require('express-validation');
const userScheduleController = require('./user-schedule.controller');
const routes = express.Router();

const prefix = '/user_schedule';

// list user schedule
routes.route('').get(userScheduleController.getListUserSchedule);

//list option company
routes.route('/company-options').get(userScheduleController.getOptionCompany);

// list option business
routes.route('/list_optionbusiness/:company_id').get(userScheduleController.getOptionBusiness);
// list store theo id business
routes.route('/store-options').get(userScheduleController.getOptionStore);
// add new user_schedule
routes.route('/create_user_schedule').post(userScheduleController.createUserSchedule);
// update detail user-schedule
routes.route('/update').post(userScheduleController.updateDetailUserSchedule);
// delete user-schedule
routes.route('/delete').post(userScheduleController.deleteUserSchedule);
// review user_schedule
routes.route('/review').post(userScheduleController.reviewUserSchedule);
// list user review
routes.route('/list-option-user-review/:shift_id').get(userScheduleController.getUserReview);
// list shift by store id
routes.route('/list_shift/:store_id').get(userScheduleController.getOptionShiftByStoreId);
// get detail user schedule
routes.route('/detail').get(userScheduleController.getDetailUserSchedule);
// get current user schedule
routes.route('/current-schedule').get(userScheduleController.getCurrentUserSchedule);

// get user shift
routes.route('/shifts-today').get(userScheduleController.getTodayShifts);

routes.route('/explanation').post(userScheduleController.updateExplanation);

routes.route('/update-review').post(userScheduleController.updateReview);

routes.route('/export').get(userScheduleController.exportScheduleSupport);

routes.route('/export-schedule').get(userScheduleController.exportSchedule);

module.exports = {
    prefix,
    routes,
};
