const express = require('express');
const validate = require('express-validation');
const rules = require('./app-config.rule');
const appConfigController = require('./app-config.controller');
const routes = express.Router();
const prefix = '/app-config';


// List paymentSlip

// List option 

routes.route('')
  .post(appConfigController.createOrUpdateAppConfig);
routes.route('')
  .get(appConfigController.getListAppConfig);
routes.route('/:appConfigId(\\d+)')
  .delete(appConfigController.deleteAppConfig);
// Detail 
routes.route('/:appConfigId(\\d+)').get(appConfigController.detailAppConfig);
routes.route('/:appConfigId(\\d+)').put(appConfigController.createOrUpdateAppConfig);
// Get by key
routes.route('/get-by-key').get(appConfigController.getByKey);

// Lấy các cài đặt trên trang 

routes.route('/pages')
  .get(appConfigController.getPageConfig)

routes.route('/pages/:page')
  .put(appConfigController.updatePageConfig)

routes.route('/update')
  .put(appConfigController.updateConfig)

module.exports = {
  prefix,
  routes,
};
