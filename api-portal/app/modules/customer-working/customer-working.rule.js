const Joi = require('joi');

const ruleCreateOrUpdate = Joi.object({
  data_leads_id: Joi.string().allow(null),
  data_leads_code: Joi.string().allow(null),
  birthday: Joi.string().allow(null),
  gender: Joi.number().allow(null),
  phone_number: Joi.string().required(),
  store_id: Joi.number().required(),
  task_type_id: Joi.number().required(),
  customer_type_id: Joi.number().allow(null),
  image_avatar: Joi.string().allow(null),
  is_active: Joi.number().required(),
});


const validateRules = {
  createCustomerWorking: {
    body: ruleCreateOrUpdate,
  },
  createCustomerWorking: {
    body: ruleCreateOrUpdate,
  },
};

module.exports = validateRules;
