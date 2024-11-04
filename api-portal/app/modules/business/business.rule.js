const Joi = require('joi');

const ruleCreateOrUpdate = {
    business_code: Joi.string().required(),
    business_name: Joi.string().required(),
    business_tax_code: Joi.string().allow('', null),
    company_id: Joi.number().required(),
    business_type_id: Joi.number().required(),
    business_phone_number: Joi.string().required(),
    business_mail: Joi.string().required(),
    opening_date: Joi.string().allow('', null),
    business_contry_id: Joi.number().allow('', null),
    business_province_id: Joi.number().allow('', null),
    business_district_id: Joi.number().allow('', null),
    business_ward_id: Joi.number().allow('', null),
    business_zip_code: Joi.string().allow('', null),
    business_address: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    is_business_place: Joi.number().valid(0, 1).required(),
    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),

    bank_account_list: Joi.array().items({
        bank_id: Joi.number().required(),
        bank_account_name: Joi.string().required(),
        bank_number: Joi.string().required(),
        bank_branch: Joi.string().allow('', null),
        is_default: Joi.number().valid(0, 1).required(),
    }),
};

const validateRules = {
    createBusiness: {
        body: ruleCreateOrUpdate,
    },
    updateBusiness: {
        body: ruleCreateOrUpdate,
    },
    changeStatusBusiness: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
