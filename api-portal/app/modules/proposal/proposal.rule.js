const Joi = require('joi');
const API_CONST = require('../../common/const/api.const');

const ruleCreateUpdate = {
    user_name: Joi.number().required(),
    effective_date: Joi.string().required(),
    change_type: Joi.number().required(),
    proposal_type_id: Joi.number().required(),
    is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
    is_system: Joi.number().valid(API_CONST.ISSYSTEM.SYSTEM, API_CONST.ISSYSTEM.NOT_SYSTEM).required(),
};

const ruleUpdateReview = {
    proposal_review_list_id: Joi.number().required(),
    is_review: Joi.required(),
    review_note: Joi.string().required(),
};

const validateRules = {
    create: {
        body: ruleCreateUpdate,
    },
    update: {
        body: ruleCreateUpdate,
    },
    update_review: {
        body: ruleUpdateReview,
    },
    status: {
        body: {
            is_active: Joi.number().valid(API_CONST.ISACTIVE.ACTIVE, API_CONST.ISACTIVE.INACTIVE).required(),
        },
    },
};

module.exports = validateRules;
