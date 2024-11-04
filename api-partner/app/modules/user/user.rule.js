const Joi = require('joi');

const ruleCreateOrUpdate = {
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  gender: Joi.number().valid(0,1).required(),
  birthday: Joi.string().regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
  email: Joi.string().email().required(),
  phone_number_1: Joi.string().allow('', null),
  phone_number: Joi.string(),
  address: Joi.string(),
  province_id: Joi.number(),
  district_id: Joi.number(),
  country_id: Joi.number(),
  // city_id: Joi.number(),
  description: Joi.string().allow('', null),
  default_picture_url: Joi.string().allow('', null),
  department_id: Joi.number().required(),
  position_id: Joi.number(),
  about_me: Joi.string().allow('', null),
};

const ruleResetPassword = {
  user_name: Joi.string().required()
};

const ruleUpdateDevicetoken = {
  device_token: Joi.string().required()
};

const ruleChangePasswordUser = {
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  re_password: Joi.string().required().valid(Joi.ref('new_password')),
};

const validateRules = {
  createUser: {
    body: Object.assign({}, ruleCreateOrUpdate, ruleResetPassword, {
      user_name: Joi.required(),
    }),
  },
  updateUser: {
    body: ruleCreateOrUpdate,
  },
  resetPassword: {
    body: ruleResetPassword,
  },
  updateDeviceToken: {
    body: ruleUpdateDevicetoken
  },
  changePasswordUser: {
    body: ruleChangePasswordUser,
  },
};

module.exports = validateRules;
