const express = require('express');
const validate = require('express-validation');
const rules = require('./account.rule');
const accountController = require('./account.controller');
const routes = express.Router();
const prefix = '/account';

routes.route('/sign-up').post(validate(rules.signUp), accountController.signUp);

routes.route('/login-social').post(validate(rules.signUpSocial), accountController.loginSocial);

routes
    .route('/user')
    .get(accountController.getProfile)
    .post(validate(rules.updateProfile), accountController.updateProfile);

routes.route('/reset-password').post(validate(rules.forgotPassword), accountController.resetPassword);

routes.route('/change-password').post(validate(rules.changePassword), accountController.changePassword);

// ds lịch sử mua hàng
routes.route('/purchase-history').get(accountController.getBuyHistoryList);

module.exports = {
    prefix,
    routes,
};
