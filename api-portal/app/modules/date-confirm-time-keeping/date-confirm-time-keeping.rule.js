const Joi = require('joi');

const RuleTimeKeepingDateConfirmCreateOrUpdate =Joi.object().keys({
    time_keeping_confirm_date_id: Joi.string().allow(null,''),
    time_keeping_confirm_date_name : Joi.string().required(),
  });

  const validateRules = {
    createTimeKeepingDateConfirm: {
      body: RuleTimeKeepingDateConfirmCreateOrUpdate,
      options: {
        contextRequest: true,
      },
    },
    updateTimeKeepingDateConfirm:  {
      body: RuleTimeKeepingDateConfirmCreateOrUpdate,
      options: {
        contextRequest: true,
      },
    },
  };

  module.exports = validateRules;
