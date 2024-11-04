const Joi = require('joi');
const omit = require('lodash/omit');

const interestContentModel = {
  interest_content_id: Joi.number().required(),
  interest_content_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(interestContentModel, ['interest_content_id']),
  },
  update: {
    body: interestContentModel,
  },
};

module.exports = rules;
