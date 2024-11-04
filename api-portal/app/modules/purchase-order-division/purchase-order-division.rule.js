const Joi = require('joi');
const omit = require('lodash/omit');

const purchaseOrderDivisionModel = {
  purchase_order_division_id: Joi.number().required(),
  purchase_order_division_name: Joi.string().trim().max(250),
  // purchase_order_id: Joi.number().integer().required(),
  // business_id: Joi.number().integer().allow(null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(purchaseOrderDivisionModel, ['purchase_order_division_id']),
  },
  update: {
    body: purchaseOrderDivisionModel,
  },
  createReviewLevel: {
    body: {
        company_id: Joi.number().required(),
        review_level_name: Joi.string().required(),
    },
},
};

module.exports = rules;
