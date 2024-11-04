const express = require('express');
const validate = require('express-validation');
const businessUserController = require('./business-user.controller');
const routes = express.Router();
const rules = require('./business-user.rule');
const prefix = '/business-user';

routes
    .route('')
    .get(businessUserController.getList)
    .post(validate(rules.create), businessUserController.create)
    .delete(businessUserController.deleteBU);

routes.route('/users').get(businessUserController.getListAllUser);
routes.route('/users/:id(\\d+)').get(businessUserController.getUserOfBus);

routes.route('/store').get(businessUserController.getStores);

module.exports = {
    prefix,
    routes,
};
