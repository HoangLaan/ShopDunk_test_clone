const express = require("express");
const validate = require("express-validation");
const userScheduleController = require("./user-schedule.controller");
const routes = express.Router();

const prefix = "/user-schedule";

// list user schedule
routes.route('').get(userScheduleController.getListUserSchedule);

//list option company
routes.route('/list-optioncompany').get(userScheduleController.getOptionCompany);

// list option business
routes.route('/list-optionbusiness/:company_id').get(userScheduleController.getOptionBusiness);
// list store theo id business  
routes.route('/list-optionstore/:business_id').get(userScheduleController.getOptionStore);

// add new user_schedule
routes.route('/create-user-schedule').post(userScheduleController.createUserSchedule);
// update detail user-schedule
routes.route('/update').post(userScheduleController.updateDetailUserSchedule);
// delete user-schedule
routes.route('/delete').post(userScheduleController.deleteUserSchedule);

/////////////////////////////////////////////////////////////////////////////////////////////////

// Lấy danh sách ca làm việc của nhân viên
// routes.route('/user/:user_name(\\d+)').get(userScheduleController.getListScheduleUser);

module.exports = {
  prefix,
  routes,
};
