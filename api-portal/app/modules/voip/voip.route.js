const express = require('express');
const voip = require('./voip.controller');

const routes = express.Router();

const prefix = '/voip';

// List options ward
routes.route('/sync').post(voip.syncExtension);

routes.route('/cdrs').get(voip.getListCdrs);

routes.route('/sync-cdrs/:sip_id').post(voip.syncDataCdrToTask);

routes.route('/recall-update').post(voip.createTaskForRecall);

// routes.route('/transfer')
//   .post(voip.transferCall);
routes.route('/export-excel').post(voip.exportExcel);

routes.route('/voip-ext').get(voip.getVoipExt);

module.exports = {
    prefix,
    routes,
};
