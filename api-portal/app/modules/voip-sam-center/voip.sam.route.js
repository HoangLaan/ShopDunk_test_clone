const express = require('express');
const voip = require('./voip.sam.controller');

const routes = express.Router();

const prefix = '/voip';

// List options ward
routes.route('/sync-sam')
  .post(voip.syncExtension);

routes.route('/cdrs-sam')
  .get(voip.getListCdrs);

routes.route('/sync-cdrs-sam/:sip_id')
  .post(voip.syncDataCdrToTask);

  
routes.route('/recall-update-sam')
.post(voip.createTaskForRecall)

// routes.route('/transfer')
//   .post(voip.transferCall);
routes.route('/export-excel-sam').post(voip.exportExcel);
module.exports = {
  prefix,
  routes,
};
