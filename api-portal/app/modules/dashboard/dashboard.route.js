const express = require('express');
const dashboardController = require('./dashboard.controller');
const routes = express.Router();
const prefix = '/dashboard';

// List
routes.route('/summary').get(dashboardController.getSummary);

routes.route('/chart/receiveslip').get(dashboardController.getReceiveslipChart);

routes.route('/announce').get(dashboardController.getListAnnounce);

routes.route("/mail").get(dashboardController.getListMail);

routes.route('/news').get(dashboardController.getListNews);

routes.route('/stock').get(dashboardController.getListStock);

routes.route('/debit').get(dashboardController.getDebit);
module.exports = {
    prefix,
    routes,
}
