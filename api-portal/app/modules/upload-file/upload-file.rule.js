const Joi = require('joi');

const ruleUpload = Joi.object().keys({
  base64: Joi.string().required(),
  folder:Joi.string().required(),
});
const validateRules = {
  upload: {
    body: ruleUpload,
  },
};

module.exports = validateRules;
