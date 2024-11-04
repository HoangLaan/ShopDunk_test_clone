const Joi = require('joi');

const ruleCreateOrUpdate = {
  company_name: Joi.string().required(),
  company_type_id: Joi.number().required(),
  open_date: Joi.string().allow('', null),
  phone_number:Joi.string().required(),
  email:Joi.string().allow('', null),
  fax:Joi.string().allow('', null),
  tax_id:Joi.string().allow('', null),
  bank_account_name:Joi.string().allow('', null),
  bank_name:Joi.string().allow('', null),
  bank_routing:Joi.string().allow('', null),
  bank_account_id:Joi.string().allow('', null),
  country_id:Joi.number().required(),
  province_id:Joi.number().required(),
  district_id:Joi.number().required(),
  ward_id:Joi.number().required(),
  address:Joi.string().required(),
  // address_full:Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createCompany: {
    body: ruleCreateOrUpdate,
  },
  updateCompany: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCompany: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
