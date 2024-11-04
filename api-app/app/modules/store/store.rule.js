const Joi = require('joi');

const ruleCreateOrUpdate = {
  store_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  area_id: Joi.number().required(),
  location_x:Joi.string().allow('', null),
  location_y:Joi.string().allow('', null),
  province_id: Joi.number().required(),
  district_id: Joi.number().required(),
  ward_id: Joi.number().required(),
  address: Joi.string().required(),
  description:Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
  createStore: {
    body: ruleCreateOrUpdate,
  },
  updateStore: {
    body: ruleCreateOrUpdate,
  },
  changeStatusStore: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
