const express = require('express');
const shiftController = require('./shift.controller');
const validate = require('express-validation');
const validateRules = require('./shift.rule');
const routes = express.Router();
const prefix = '/shift';

// danh sách ca làm viễ
routes.route('').get(shiftController.getListShift);

// List options am-company
routes.route('/get-options').get(shiftController.getOptions);

// thêm mới ca lam viec
routes.route('').post(validate(validateRules.createShift), shiftController.createShift);

// cập nhật ca lam viec
routes.route('/:shift_id').put(validate(validateRules.updateShift), shiftController.updateShift);
// chi tiết ca làm việc
routes.route('/:shift_id(\\d+)').get(shiftController.getDetailShift);
// xoa ca lam viec
routes.route('/:shift_id/delete').put(shiftController.deteleShift);

// gen code
routes.route('/shift-code').get(shiftController.gencode);

routes.route('/store').get(shiftController.getStoreList);

module.exports = {
    prefix,
    routes,
};
