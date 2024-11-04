const express = require('express');
const voipReport = require('./voip-report.controller');
const routes = express.Router();
const prefix = '/voip-report';

routes.route('').get(voipReport.getListVoipReport);

routes.route('/export-excel').post(voipReport.exportExcel);

module.exports = {
  prefix,
  routes,
};
