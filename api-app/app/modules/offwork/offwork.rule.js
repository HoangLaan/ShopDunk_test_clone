const Joi = require('joi');

const ruleCreateOrUpdate = {
    fromdate: Joi.string().required(),
    todate: Joi.string().required(),
    content_off_work: Joi.string().required(),
    off_work_type_id: Joi.number().required(),
};

const validateRules = {
    getListOffWork: {
        page: Joi.number().min(1).default(1),
        itemsPerPage: Joi.number().min(1).default(10),
        status: Joi.number().min(1).max(4).default(4),
        type: Joi.number().min(1).optional(),
        created_date_from: Joi.string().allow(null, ''),
        created_date_to: Joi.string().allow(null, ''),
    },
    createOffWork: ruleCreateOrUpdate,
    updateOffWork: ruleCreateOrUpdate,
};

module.exports = validateRules;
