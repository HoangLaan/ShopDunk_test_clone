const Joi = require('joi');
const omit = require('lodash/omit');

const internalTransferTypeModel = {
  internal_transfer_type_id: Joi.number().required(),
  internal_transfer_type_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(internalTransferTypeModel, ['internal_transfer_type_id']),
  },
  update: {
    body: internalTransferTypeModel,
  },
  createReviewLevel: {
    body: {
        company_id: Joi.number().required(),
        review_level_name: Joi.string().required(),
    },
  },
};

module.exports = rules;
