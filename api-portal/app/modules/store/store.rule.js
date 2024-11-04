const Joi = require('joi');

const ruleCreateOrUpdate = {
    store_code: Joi.string().required(),
    store_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    open_time: Joi.string().required(),
    close_time: Joi.string().required(),
    //map_url: Joi.string().required(),
    //banner_url: Joi.string().required(),
    //images: Joi.array().required(),
    area_id: Joi.number().required(),
    business_id: Joi.number().required(),
    company_id: Joi.number().required(),
    province_id: Joi.number().required(),
    district_id: Joi.number().required(),
    ward_id: Joi.number().required(),
    address: Joi.string().required(),
    //description: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
    status_type: Joi.number().required(),
    // acreage: Joi.number().required(),
    brand_id: Joi.number().required(),
    // cluster_id: Joi.number().required(),
    store_type_id: Joi.number().required(),
};

const validateRules = {
    createStore: {
        body: ruleCreateOrUpdate,
    },
    updateStore: {
        body: ruleCreateOrUpdate,
    },
    deleteStore: {
        body: {
            list_id: Joi.array().required().min(1),
        },
    },
};

module.exports = validateRules;
