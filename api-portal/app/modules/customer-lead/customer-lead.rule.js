const Joi = require('joi');

const ruleCreateOrUpdate = Joi.object({
    data_leads_id: Joi.string().allow('', null),
    data_leads_code: Joi.string().allow('', null),
    full_name: Joi.string().required(),
    birthday: Joi.string().allow('', null),
    gender: Joi.number().allow('', null),
    phone_number: Joi.string().required(),
    email: Joi.string().email().allow('', null),
    zalo_id: Joi.string().allow('', null),
    facebook_id: Joi.string().allow('', null),
    affiliate: Joi.string().allow('', null),
    source_id: Joi.number().allow('', null),
    presenter_id: Joi.number().allow('', null),
    customer_type_id: Joi.number().allow('', null),
    image_avatar: Joi.string().allow('', null),
    country_id: Joi.number().allow('', null),
    province_id: Joi.number().allow('', null),
    district_id: Joi.number().allow('', null),
    ward_id: Joi.number().allow('', null),
    postal_code: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    id_card: Joi.string().allow('', null),
    id_card_date: Joi.string().allow('', null),
    id_card_place: Joi.string().allow('', null),
    career_id: Joi.number().allow('', null),
    customer_company_id: Joi.string().allow('', null),
    is_active: Joi.number().required(),
});

const validateRules = {
    createCustomerLead: {
        body: ruleCreateOrUpdate,
    },
    updateCustomerLead: {
        body: ruleCreateOrUpdate,
    },
    createCustomerCompany: {
        body: {
            customer_company_name: Joi.string().required(),
            tax_code: Joi.string().required(),
            phone_number: Joi.string().required(),
            phone_number_secondary: Joi.string(),
            email: Joi.string().required(),
            representative_name: Joi.string().required(),
        },
    },
};

module.exports = validateRules;
