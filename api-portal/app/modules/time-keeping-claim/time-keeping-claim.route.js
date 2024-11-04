const express = require('express');
const validate = require('express-validation');
const timeKeepingClaimController = require('./time-keeping-claim.controller');
const routes = express.Router();
const rules = require('./time-keeping-claim.rule');
const prefix = '/time-keeping-claim';


// done
routes.route('').post(validate(rules.createTimeKeepingClaim), timeKeepingClaimController.createTimeKeepingClaim)
.put(validate(rules.updateTimeKeepingClaim), timeKeepingClaimController.updateTimeKeepingClaim)
.delete(timeKeepingClaimController.deleteTimeKeepingClaim);

// done
routes.route('').get(timeKeepingClaimController.getListTimeKeepingClaim);

routes.route('/:id(\\d+)').get(timeKeepingClaimController.detailTimeKeepingClaim);

routes.route('/reviewed').put(timeKeepingClaimController.updateReview);

routes.route('/schedule/:id(\\d+)').get(timeKeepingClaimController.getDetailTimeKeepingClaimByScheduleId);

routes.route('/count-explain').get(timeKeepingClaimController.countTimesExplained);

routes.route('/export-excel').get(timeKeepingClaimController.ExportExcelTimeKeepingClaim);

module.exports = {
    prefix,
    routes,
};
