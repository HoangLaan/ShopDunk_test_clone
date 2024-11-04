const Joi = require('joi');

const itemsArray = Joi.object().keys({
    product_attribute_id: Joi.number().required(),
});
const ruleCreateOrUpdate = Joi.object().keys({
    company_id: Joi.number().required().allow('', null),
    add_function_id: Joi.number().required(),

    edit_function_id: Joi.number().required(),

    delete_function_id: Joi.number().required(),

    view_function_id: Joi.number().required(),

    // pictures: Joi.array().items(Joi.string()).min(1).required(),
    parent_id: Joi.number().allow('', null).allow('', null),
    description: Joi.string().allow('', null).allow('', null), //CONFIRMVALIDATE
    is_active: Joi.number().valid(0, 1).required().allow('', null),
    material_list: Joi.array().items(
        Joi.object().keys({
            material_id: Joi.number().required(),
            number: Joi.number().required(),
            note: Joi.string().allow('', null),
        }),
    ),
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
            attribute_name: Joi.string().required(),
        }),
    },
};

module.exports = validateRules;
