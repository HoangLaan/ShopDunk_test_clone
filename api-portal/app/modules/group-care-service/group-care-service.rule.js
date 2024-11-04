const Joi = require('joi');

const rulePicture = Joi.object().keys({
    // picture_url: Joi.string().allow(null,''),
    picture_alias: Joi.string().allow(null, ''),
    is_default: Joi.number().valid(0, 1).allow(null),
});
const ruleBusiness = Joi.object().keys({
    business_id: Joi.number().required(),
});
const ruleAttribute = Joi.object().keys({
    product_attribute_id: Joi.number().required(),
    attribute_values: Joi.string().allow(null, ''),
});
const ruleCreateOrUpdate = Joi.object().keys({
    // product_category_id: Joi.number().required(),
    // group_care_service_id: Joi.number().required(),
    // product_id: Joi.number().required(),
    // care_service_name: Joi.string().required(),
    // model_id:  Joi.number().required(),
    // images: Joi.array().min(1).required(),
    // // attributes: Joi.array().min(1).required()
    // sub_unit_list: Joi.array().items(
    //     Joi.object().keys({
    //         sub_unit_id: Joi.number().required(),
    //         main_unit_id: Joi.number().required(),
    //         note: Joi.string().allow(null, ''),
    //         density_value_1: Joi.number().min(1).required(),
    //         density_value_2: Joi.number().min(1).required(),
    //     }),
    // ),
});

const ruleChangeStatus = {
    is_active: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createGroupCareService: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    updateGroupCareService: {
        body: ruleCreateOrUpdate,
        options: {
            contextRequest: true,
        },
    },
    // changeStatusCareService: ruleChangeStatus,
    // createBarcode: {
    //     body: Joi.object().keys({
    //         product_ids: Joi.array().min(1),
    //     }),
    //     options: {
    //         contextRequest: true,
    //     },
    // },
    // printBarcode: {
    //     body: Joi.object().keys({
    //         list_apply_product: Joi.array().min(1),
    //         size: Joi.number().valid(1, 2).allow(null),
    //     }),
    //     options: {
    //         contextRequest: true,
    //     },
    // },
    // createAttribute: {
    //     body: Joi.object().keys({
    //         attribute_name: Joi.string().required(),
    //     }),
    // },
};

module.exports = validateRules;
