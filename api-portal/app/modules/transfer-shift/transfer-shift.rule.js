const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    transfer_shift_type_id: Joi.required(),
    date_to: Joi.string().required(),
    date_from: Joi.string().required(),
    new_shift_id: Joi.required(),
    current_shift_id: Joi.required(),
    current_store_id: Joi.required(),
    current_business_id: Joi.required(),
    business_id: Joi.required(),
    store_id: Joi.required(),
    reason: Joi.string().required(),
    //
};
const ruleUpdateReview = {
    transfer_shift_review_list_id: Joi.number().required(),
};

const validateRules = {
    create: {
        body: ruleCreateUpdate,
    },
    update: {
        body: ruleCreateUpdate,
    },
    updateReview: {
        body: ruleUpdateReview,
    },
    status: {
        body: {
            is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
        },
    },
};

module.exports = validateRules;
