const Joi = require('joi');

const ruleGetList = {
    search: Joi.string().allow('', null),
    create_date_from: Joi.string().allow('', null),
    create_date_to: Joi.string().allow('', null),
    stocks_take_type_id: Joi.number().allow('', null),
    stocks_take_request_type_id: Joi.number().allow('', null),
    is_reviewed: Joi.number().integer().allow(0, 1, 2, 3, 4, 5, null),
    is_processed: Joi.number().integer().allow(0, 1, 2, 3, 4, 5, null),
    is_active: Joi.number().integer().allow(0, 1, null),
    //is_processed: Joi.number().integer().allow(0, 1),
    itemsPerPage: Joi.number().required(),
    page: Joi.number().required(),
};

const ruleCreateOrUpdate = {
    stocks_take_request_name: Joi.string().required(),
    is_active: Joi.number().valid(0, 1),
    stocks_take_request_code: Joi.string(),
    stocks_take_type_id: Joi.number(),
    stocks_take_request_name: Joi.string(),
    department_request_id: Joi.number(),
    stocks_id: Joi.number(),
    receiver: Joi.string(),
    stocks_take_request_user: Joi.alternatives().try(Joi.string(), Joi.number()),
    stocks_take_request_date: Joi.string(),
    description: Joi.string(),
    user_review_list: Joi.array().items(
        Joi.object({
            stocks_review_level_id: Joi.number(),
            department_id: Joi.number(),
            user_name: Joi.string(),
            is_main_responsibility: Joi.number().allow(0, 1),
        }),
    ),
    stocks_take_users: Joi.array().items(
        Joi.object({
            user_name: Joi.alternatives().try(Joi.string(), Joi.number()),
            department_id: Joi.number(),
            is_main_responsibility: Joi.number().integer().allow(0, 1),
        }),
    ),
    product_list: Joi.array(),
    store_apply_list: Joi.array(),
    address: Joi.string(),
    stocks_list_id: Joi.array(),

    is_all_product: Joi.number().valid(0, 1),
};

const validateRules = {
    createStocksTakeType: ruleCreateOrUpdate,
    updateStocksTakeType: {
        body: ruleCreateOrUpdate,
    },
    ruleGetList: ruleGetList,
};

module.exports = validateRules;
