const Joi = require('joi');

const ruleCreate = {
//   company_id: Joi.number().required(),
  bank_number: Joi.string().required(),
  bank_id: Joi.string().required(),
//   province_id: Joi.number().allow(null),
  bank_branch: Joi.string().allow(null),
  branch_address: Joi.string().allow(null),
  bank_username: Joi.string().required(),
  description: Joi.string().allow(null),
  is_active: Joi.number().required(),
};

const rules = {
    create: {
        body: ruleCreate,
    },
    update: {
        body: ruleCreate,
    },
};

module.exports = rules;
