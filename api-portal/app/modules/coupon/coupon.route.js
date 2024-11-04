const express = require('express');
const couponController = require('./coupon.controller');
const routes = express.Router();
const prefix = '/coupon';

routes.route('/getOption').get(couponController.getOptions);
routes.route('/get-options').get(couponController.getCouponOptions);

routes
    .route('')
    .get(couponController.getListCoupon)
    .post(couponController.createOrUpdateCoupon)
    .put(couponController.createOrUpdateCoupon)
    .delete(couponController.deleteCoupon);

routes.route('/:coupon_id/detail').get(couponController.getCouponDetail);
routes.route('/:coupon_id/detail/list-coupon').get(couponController.getListDetailCouponCode);
routes.route('/:coupon_id/detail/list-auto-gen-coupon').get(couponController.getListDetailAutoGenCouponCode);

routes.route('/:coupon_id/detail/list-auto-gen-coupon').get(couponController.getListDetailAutoGenCouponCode);
routes.route('/export-excel/:coupon_id').get(couponController.exportExcel);
module.exports = {
    prefix,
    routes,
};
