const express = require('express');
const validate = require('express-validation');
const timeKeepingClaimTypeController = require('./time-keeping-claim-type.controller');
const routes = express.Router();
const rules = require('./time-keeping-claim-type.rule');
const prefix = '/time-keeping-claim-type';

routes.route('/get-options').get(timeKeepingClaimTypeController.getOptions);

routes.route('/review-levels').get(timeKeepingClaimTypeController.getReviewLevels);

routes.route('/count-explain').get(timeKeepingClaimTypeController.getTotalExplainAllTimeKeepingClaimType);


module.exports = {
    prefix,
    routes,
};
