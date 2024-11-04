const Joi = require('joi');
const omit = require('lodash/omit');

const zaloTemplateModel = {
  zalo_template_id: Joi.number().required(),
  zalo_template_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(zaloTemplateModel, ['zalo_template_id']),
  },
  update: {
    body: zaloTemplateModel,
  },
};

module.exports = rules;
