const Joi = require('joi');

const ruleCreateOrUpdate = {
  business_name: Joi.string().required(),
  company_id: Joi.number().required(),
  business_type_id: Joi.number().required(),
  business_banner: Joi.string().allow('', null),
  business_icon_url: Joi.string().allow('', null),
  business_phone_number: Joi.string().required(),
  business_mail: Joi.string().allow('', null),
  business_website: Joi.string().allow('', null),
  opening_date: Joi.string().allow('', null),
  business_contry_id: Joi.number().allow('', null),
  business_state_id: Joi.number().allow('', null),
  business_city_id: Joi.number().allow('', null),
  business_state: Joi.string().allow('', null),
  business_province_id: Joi.number().allow('', null),
  business_district_id: Joi.number().allow('', null),
  business_ward_id: Joi.number().allow('', null),
  business_address: Joi.string().allow('', null),
  business_address_full: Joi.string().allow('', null),
  location_x: Joi.string().allow('', null),
  location_y: Joi.string().allow('', null),
  open_time: Joi.string().allow('', null),
  close_time: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createAMBusiness: {
    body: ruleCreateOrUpdate,
  },
  updateAMBusiness: {
    body: ruleCreateOrUpdate,
  },
  changeStatusAMBusiness: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
