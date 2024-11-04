const express = require('express');
const validate = require('express-validation');
const profitLossController = require('./profit-loss.controller');
const rules = require('./profit-loss.rule');
const routes = express.Router();
const prefix = '/profit-loss';

routes.route('').get(profitLossController.getList).post(validate(rules.create), profitLossController.create);

routes.route('/history').get(profitLossController.getListHistory);

routes.route('/export-excel').post(profitLossController.exportExcel);

routes.route('/export-history-excel').get(profitLossController.exportHistoryExcel);

module.exports = {
    prefix,
    routes,
};
