const Joi = require('joi');

const ruleCreateOrUpdate = {
  descriptions: Joi.string().allow(null, ''),
}

const ruleCreate = {
    ...ruleCreateOrUpdate,
};

const ruleUpdate = {
  ...ruleCreateOrUpdate,
};

const ruleDelete = {
  ...ruleCreateOrUpdate,
};

const validateRules = {
    create: {
      body: ruleCreate,
    },
    update: {
      body: ruleUpdate,
    },
    delete: {
      body: ruleDelete,
    }
};

module.exports = validateRules;
