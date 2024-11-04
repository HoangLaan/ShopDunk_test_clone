const Joi = require('joi');
const validate = require('express-validation');

const ruleCreateOrUpdate = {
    purchase_requisition_date: Joi.string().length(10).required(),
    department_request_id: Joi.number().min(1).required(),
    business_request_id: Joi.number().min(1).required(),
    // store_request_id: Joi.number().min(1).required(),
    product_list: Joi.array()
        .items(
            Joi.object({
                product_id: Joi.number().min(1).required(),
                quantity: Joi.number().min(1).required(),
            }),
        )
        .min(1)
        .required(),
    is_active: Joi.number().valid(0, 1).required(),
    description: Joi.string().allow('', null).max(500),
    to_buy_date: Joi.string().allow('', null).max(50),
    pr_status_id: Joi.number().valid(1, 2, 3).required(),
};

const validateRules = {
    createOrUpdate: async (req, res, next) => {
        const fields = JSON.parse(req.body.fields);
        req.body = fields;
        validate({ body: ruleCreateOrUpdate })(req, res, next);
    },
    createReviewLevel: {
        body: {
            company_id: Joi.number().required(),
            review_level_name: Joi.string().required(),
        },
    },
    updateReview: {
        body: {
            purchase_requisition_id: Joi.number().required(),
        },
    },
};

module.exports = validateRules;
