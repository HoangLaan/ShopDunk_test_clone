const Joi = require('joi');

const createOrUpdate = {
  mail_subject: Joi.string(),
  mail_content: Joi.string().required(),
  is_send_to_all: Joi.number().valid(0, 1),
  is_draft: Joi.number().valid(0, 1),
  department_id: Joi.array(),
  user_name: Joi.array(),
  cc: Joi.array()
};

const validateRules = {
  createOrUpdate: {
    body: createOrUpdate,
  },
};

module.exports = validateRules;
