const Joi = require('joi');

const product = {
    product_id: Joi.number().required(),
    quantity: Joi.number().required()
};


const validateRules = {
    createOrUpdateHashTag: {
        body: {
            hash_tag_id: Joi.number().required(),
            is_tag: Joi.number().valid(0, 1).required()
        },
    },
    createNote: {
        body: {
            note: Joi.string().max(2000).required()
        }
    },
    updateFBUser: {
        body: {
            full_name: Joi.string().max(2000).required()
        }
    },
    createHashTag: {
        body: {
            name: Joi.string().max(100).required()
        }
    },
    updateHashTag: {
        body: {
            color: Joi.string().max(100).required()
        }
    },
    createOrder: {
        body: {
            items: Joi.array().min(1).items(product),
        }
    },
    pageToSync: {
        body: {
            page_ids: Joi.array().min(1)
        }
    },
    deletePageConnect: {
        body: {
            page_ids: Joi.when('is_disconnect_all', {
                is: 0,
                then: Joi.array().min(1).required()
            }),
            is_disconnect_all: Joi.number().valid(0, 1).required(),
        }
    }
};

module.exports = validateRules;
