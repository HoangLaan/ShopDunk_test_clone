const Joi = require('joi');

const ruleCreateOrUpdate = {
    //comment_content: Joi.string().required(),

};

const validateRules = {
  createNewsComment : {
    body: ruleCreateOrUpdate,
  },
  updateNewsComment: {
    body: ruleCreateOrUpdate,
  },
  changeStatusNews: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
