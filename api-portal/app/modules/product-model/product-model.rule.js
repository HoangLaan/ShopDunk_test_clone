const Joi = require('joi');

const itemsArray = Joi.object().keys({
    product_attribute_id: Joi.number().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
    product_category_id: Joi.number().required().allow('', null),
    model_code: Joi.string().required(),
    model_name: Joi.string().required(),
    display_name: Joi.string().required()
});


const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
    changeStatus: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
    createAttribute: {
        body: Joi.object().keys({
            attribute_name: Joi.string().required()
        })
    }
};

module.exports = validateRules;
