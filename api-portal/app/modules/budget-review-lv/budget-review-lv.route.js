const express = require('express');
const controller = require('./budget-review-lv.controller');
const routes = express.Router();
const prefix = '/budget-review-lv';


routes.route('').post(controller.createBudgetReviewLv)
                      .get(controller.getListBudgetReviewLv)

routes.route('/:id(\\d+)').delete(controller.deleteBudgetReviewLv)
  .get(controller.getListBudgetReviewLv)
// Get User Review
routes.route('/users')
  .get(controller.getListUserReview);


module.exports = {
  prefix,
  routes,
};
