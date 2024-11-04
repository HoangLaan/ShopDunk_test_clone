const Joi = require('joi');
const PLATFORM = require('../../common/const/platform.const');

const ruleCreateToken = Joi.object()
    .keys({
        user_name: Joi.string().optional(),
        password: Joi.string().optional(),
        platform: Joi.string().valid(PLATFORM.MOBILE, PLATFORM.PORTAL).optional(),
        biometricKey: Joi.string().optional(),
    })
    .or('biometricKey', 'user_name')
    .required();

const validateRules = {
    createToken: {
        body: ruleCreateToken,
    },
    refreshToken: {
        body: {
            refreshToken: Joi.string().required(),
        },
    },
};

module.exports = validateRules;
