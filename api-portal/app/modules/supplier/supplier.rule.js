const Joi = require('joi');

const ruleCreateOrUpdate = {
    supplier_name: Joi.string().required(),
    // altname: Joi.string().required(),
    // representativename: Joi.string().required(),
    // province_id: Joi.number().required(),
    // district_id: Joi.number().required(),
    // ward_id: Joi.number().required(),
    // address: Joi.string().required(),
    // description:Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createSupplier: {
        body: ruleCreateOrUpdate,
    },
    updateSupplier: {
        body: ruleCreateOrUpdate,
    },
    changeStatusSupplier: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
};

module.exports = validateRules;
