const Joi = require("joi");

const createOrUpdateSchedule = {
  store_id: Joi.number().required(),
  shift_id: Joi.number().required(),
  user_name: Joi.string().required(),
  shift_date: Joi.string().required(),
};
const createOrUpdateTimeKeeping = {
  shift_id: Joi.number().required(),
  user_name: Joi.string().required(),
  shift_date: Joi.string().required(),
  time_start: Joi.string().required(),
  // time_end: Joi.string().required(),
};

const validateRules = {
  createOrUpdateSchedule: {
    body: createOrUpdateSchedule,
  },
  createOrUpdateTimeKeeping: {
    body: createOrUpdateTimeKeeping,
  },

};

module.exports = validateRules;