const Joi = require('joi');

const ruleSendOne = {
    email: Joi.string().email().required(),
};

const ruleSendList = {
    email_list: Joi.array().items(Joi.string().email()).required(),
};

const createCampaign = {
    type: Joi.string().valid(['regular', 'plaintext', 'absplit', 'rss', 'variate']).default('plaintext'),
};

const validateRules = {
    sendOne: {
        body: ruleSendOne,
    },
    sendList: {
        body: ruleSendList,
    },
    createCampaign: {
        body: createCampaign,
    },
};

module.exports = validateRules;
