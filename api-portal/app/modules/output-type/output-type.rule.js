const Joi = require('joi');

const rulePriceReviewLV = Joi.object().keys({
    price_review_level_id: Joi.number().required(),
    department_id: Joi.number().required(),
    is_auto_review: Joi.allow(null, 0).valid(0, 1),
    user_names: Joi.string().allow(null, ''),
});
const ruleCreateOrUpdate = Joi.object().keys({
    output_type_name: Joi.string().required(),
    is_vat: Joi.valid(0, 1).required().allow(null, 0),
    vat_id: Joi.when('is_vat', {
        is: 1,
        then: Joi.number().required(),
        otherwise: Joi.allow(null, 0),
    }),
    company_id: Joi.number().allow(null),
    area_id: Joi.string().required(),
    //product_categorie_ids: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    price_review_lv_users: Joi.array().required().items(rulePriceReviewLV),
    is_active: Joi.number().valid(0, 1).required(),
});
const rulechangeStatus = {
    is_active: Joi.number().valid(0, 1).required(),
};
const validateRules = {
    createOutputType: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    updateOutputType: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    changeStatusOutputType: rulechangeStatus,
};

module.exports = validateRules;
