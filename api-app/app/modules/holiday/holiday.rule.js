const Joi = require('joi');

const RuleHolidayCreateOrUpdate =Joi.object().keys({
    holiday_id: Joi.string().allow(null,''),
    holiday_name : Joi.string().required(),
  });

  const validateRules = {
    createHoliday: {
      body: RuleHolidayCreateOrUpdate,
      options: {
        contextRequest: true,
      },
    },
    updateHoliday:  {
      body: RuleHolidayCreateOrUpdate,
      options: {
        contextRequest: true,
      },
    },
  };

  module.exports = validateRules;