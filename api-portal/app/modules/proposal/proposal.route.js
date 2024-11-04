const express = require('express');
const validate = require('express-validation');
const rules = require('./proposal.rule');
const controller = require('./proposal.controller');

const routes = express.Router();

const prefix = '/proposal';

// List
routes.route('').get(controller.getListProposal);

//List review
routes.route('/get-review').get(controller.getListReview);

//Get information user
routes.route('/get-user').get(controller.getUserInformation);

// Export PdexportPDF
routes.route('/export-pdf')
  .get(controller.exportPDF);
// Create new
routes.route('').post(validate(rules.create), controller.createProposal);

//Update review
routes.route('/update-review').put(validate(rules.update_review), controller.updateReviewProposal);

// Update
routes.route('/:id').put(validate(rules.update), controller.updateProposal);

// Delete
routes.route('').delete(controller.deleteProposal);

// Detail
routes.route('/:id').get(controller.detailProposal);

module.exports = {
    prefix,
    routes,
};
