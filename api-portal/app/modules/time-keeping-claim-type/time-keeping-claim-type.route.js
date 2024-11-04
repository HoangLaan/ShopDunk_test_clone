const express = require('express');
const validate = require('express-validation');
const timeKeepingClaimTypeController = require('./time-keeping-claim-type.controller');
const routes = express.Router();
const rules = require('./time-keeping-claim-type.rule');
const prefix = '/time-keeping-claim-type';

// done
routes.route('/users').get(timeKeepingClaimTypeController.getUserList);

// done
routes.route('/review-level')
.get(timeKeepingClaimTypeController.getListReviewLevel)
.post(timeKeepingClaimTypeController.createOrUpdateReviewLevel)
.delete(timeKeepingClaimTypeController.deleteReviewLevel);

// done
routes.route('/user-options').get(timeKeepingClaimTypeController.getUsersByPosition);

// done
routes.route('').post(validate(rules.createTimeKeepingClaimType), timeKeepingClaimTypeController.createTimeKeepingClaimType)
.put(validate(rules.updateTimeKeepingClaimType), timeKeepingClaimTypeController.updateTimeKeepingClaimType)
.delete(timeKeepingClaimTypeController.deleteTimeKeepingClaimType);

// done
routes.route('').get(timeKeepingClaimTypeController.getListTimeKeepingClaimType);

routes.route('/:id(\\d+)').get(timeKeepingClaimTypeController.detailTimeKeepingClaimType);

routes.route('/getusersbytypeclaimid').get(timeKeepingClaimTypeController.getUsersByTypeClaimId);

//routes.route('/').delete(timeKeepingClaimTypeController.deleteListTimeKeepingClaimType);

module.exports = {
    prefix,
    routes,
};
