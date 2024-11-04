const Joi = require('joi');
const ruleCreateOrUpdate = Joi.object().keys({
    relationship_name: Joi.string().required(),
    decription: Joi.string().allow(null),
    company_id: Joi.number().allow(null),
    is_system: Joi.number().valid(0, 1).allow(null),
});
const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
