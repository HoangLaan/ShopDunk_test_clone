const Joi = require('joi');

const ruleCreateOrUpdate = Joi.object().keys({
    list: Joi.array()
        .items({
            product_id: Joi.number().integer(),
        })
        .required(),
});

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
};

module.exports = validateRules;
