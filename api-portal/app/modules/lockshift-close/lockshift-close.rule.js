const Joi = require('joi');

const ruleCreateOrUpdate = {
    lockshift_id: Joi.number().integer(),
    parent_id: Joi.number().integer(),
    store_id: Joi.number().integer().required(),
    shift_id: Joi.number().integer().required(),
    shift_leader: Joi.string().allow([null, '']).default(''),
    total_cash: Joi.number(),
    lockshift_type: Joi.number().valid(0, 1),
    is_locked_shift: Joi.number().valid(0, 1),
    note: Joi.string().allow([null, '']),
    order_number: Joi.number(),
};

const ruleCreateOrUpdateAll = {
    lockshift_id: Joi.number().integer().allow([null]),
    parent_id: Joi.number().integer(),
    store_id: Joi.number().integer().required(),
    shift_id: Joi.number().integer().required(),
    shift_leader: Joi.string().allow([null, '']).default(''),
    total_cash: Joi.number().allow([null]),
    lockshift_type: Joi.number().valid(0, 1),
    is_locked_shift: Joi.number().valid(0, 1),
    note: Joi.string().allow([null, '']),
    order_number: Joi.number(),
    cash_list: Joi.array().items({
        lockshift_id: Joi.number().integer(),
        denominations_id: Joi.number().integer(),
        actual_quantity: Joi.number().integer().allow(['', null]),
        total_money: Joi.number().integer().allow(['', null]),
        note: Joi.string().allow(['', null]),
    }),
    product_list: Joi.array().items({
        lockshift_id: Joi.number().integer().allow([null]),
        product_id: Joi.number().integer(),
        stocks_id: Joi.number().integer().allow([null]),
        actual_quantity: Joi.number().integer().allow([null]),
        total_inventory: Joi.number().integer().allow([null]),
        difference_value: Joi.number().integer().allow([null]),
        note: Joi.string().allow(['', null]),
    }),
    equipment_list: Joi.array().items({
        lockshift_id: Joi.number().integer().allow([null]),
        equipment_id: Joi.number().integer(),
        stocks_id: Joi.number().integer(),
        actual_quantity: Joi.number().integer(),
        total_inventory: Joi.number().integer(),
        difference_value: Joi.number().integer(),
        note: Joi.string().allow(['', null]),
    }),
};

const getProductInventory = {
    products: Joi.array().items({
        product_id: Joi.number().integer().min(1),
        stock_id: Joi.number().integer().min(1),
    }),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },
    createAll: {
        body: ruleCreateOrUpdateAll,
    },
    updateAll: {
        body: ruleCreateOrUpdateAll,
    },
    getProductInventory: {
        body: getProductInventory,
    },
};

module.exports = validateRules;
