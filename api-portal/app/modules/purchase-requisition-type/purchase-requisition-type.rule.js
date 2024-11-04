const Joi = require('joi');
const omit = require('lodash/omit');

const purchaseRequisitionTypeModel = {
  purchase_requisition_type_id: Joi.number().required(),
  purchase_requisition_type_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(purchaseRequisitionTypeModel, ['purchase_requisition_type_id']),
  },
  update: {
    body: purchaseRequisitionTypeModel,
  },
  createReviewLevel: {
    body: {
        company_id: Joi.number().required(),
        review_level_name: Joi.string().required(),
    },
  },
};

module.exports = rules;
