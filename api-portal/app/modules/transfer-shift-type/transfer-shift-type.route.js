const express = require('express');
const validate = require('express-validation');
const rules = require('./transfer-shift-type.rule');
const transferShiftTypeController = require('./transfer-shift-type.controller');

const routes = express.Router();

const prefix = '/transfer-shift-type';

routes.route('').get(transferShiftTypeController.getListTransferShiftType);

routes.route('').post(validate(rules.create), transferShiftTypeController.createTransferShiftType);

routes.route('/:id(\\d+)').put(validate(rules.update), transferShiftTypeController.updateTransferShiftType);

routes.route('').delete(transferShiftTypeController.deleteTransferShiftType);

routes.route('/:id(\\d+)').get(transferShiftTypeController.detailTransferShiftType);

// done
routes.route('/company-options').get(transferShiftTypeController.getCompanyOptions);

// done
routes.route('/department-options').get(transferShiftTypeController.getDepartmentOptions);

// done
routes.route('/position-options').get(transferShiftTypeController.getPositionOptions);

routes.route('/review-level').post(transferShiftTypeController.createReviewLevel);

routes.route('/review-level').get(transferShiftTypeController.getListReviewLevel);

routes.route('/user-options').get(transferShiftTypeController.getUserOptions);

module.exports = {
    prefix,
    routes,
};
