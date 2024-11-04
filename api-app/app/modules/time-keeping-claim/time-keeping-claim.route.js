const express = require('express');
const validate = require('express-validation');
const timeKeepingClaimController = require('./time-keeping-claim.controller');
const routes = express.Router();
const rules = require('./time-keeping-claim.rule');
const prefix = '/time-keeping-claim';


routes.route('')
.post(validate(rules.createTimeKeepingClaim), timeKeepingClaimController.createTimeKeepingClaim)

routes.route('/:id(\\d+)').get(timeKeepingClaimController.detailTimeKeepingClaim);

routes.route('/schedule/:id(\\d+)').get(timeKeepingClaimController.getDetailTimeKeepingClaimByScheduleId);

module.exports = {
    prefix,
    routes,
};
