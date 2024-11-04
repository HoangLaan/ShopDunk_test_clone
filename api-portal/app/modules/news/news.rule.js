const Joi = require('joi');

const ruleCreateOrUpdate = {
  news_title: Joi.string().required(),
  content: Joi.string().allow('', null),
  image_url: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createNews: {
    body: ruleCreateOrUpdate,
  },
  updateNews: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNews: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
