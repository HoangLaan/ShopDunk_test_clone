const express = require('express');
const validate = require('express-validation');
const controller = require('./discount-program.controller');
const routes = express.Router();
const rules = require('./discount-program.rule');
const prefix = '/discount-program';

// List discount
routes.route('').post(controller.createDiscountProgram).get(controller.getList);

routes.route('/statitic').get(controller.getStatiticDiscountProgram);

// Detail a discount
routes.route('/:discount_program_id(\\d+)').get(controller.detail);
// Detail a discount
routes.route('/:discount_program_id(\\d+)').put(controller.createDiscountProgram);

// Delete a discount
routes.route('').delete(controller.deleteDiscountProgram);

// Change duyệt
routes.route('/:discount_program_id/approve').put(validate(rules.approve), controller.approveReview);

routes.route('/get-options').get(controller.getOptions);

routes.route('/get-discount-products').get(controller.getDiscountProduct);

module.exports = {
    prefix,
    routes,
};
