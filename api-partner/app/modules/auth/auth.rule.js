const Joi = require('joi');
const PLATFORM = require('../../common/const/platform.const');

const validateRules = {
  createToken: {
    body: {
      user_name: Joi.string().required(),
      password: Joi.string().required(),
      platform: Joi.string().valid(PLATFORM.MOBILE, PLATFORM.PORTAL).required(),
    },
  },
  refreshToken: {
    body: {
      refreshToken: Joi.string().required(),
    },
  },
};

module.exports = validateRules;
