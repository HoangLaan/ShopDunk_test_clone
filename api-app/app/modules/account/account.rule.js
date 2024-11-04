const Joi = require('joi');

const ruleSignUp = {
    full_name: Joi.string().required(),
    password: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string().allow('', null),
    confirm_password: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .options({ language: { any: { allowOnly: "must match password" } } }),
};

const ruleSignUpSocial = {
    full_name: Joi.string().required(),
    social_id: Joi.string().required(),
    type: Joi.string().valid("zalo", "fb", "google", "apple").required(),
};

const ruleChangePassword = {
    new_password: Joi.string().required(),
    confirm_new_password: Joi.any()
        .valid(Joi.ref("new_password"))
        .required()
        .options({ language: { any: { allowOnly: "must match password" } } }),
    current_password: Joi.string().required(),
};

const ruleForgotPassword = {
    email: Joi.string().email().required(),
};

const ruleCheckResetPass = {
    reset_password_id: Joi.number().required(),
    request_code: Joi.string().required()
};

const ruleResetPassword = {
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().required(),
};

const ruleUpdateProfile = {
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string()
        .regex(/^[0-9]{7,10}$/)
        .required(),
    address: Joi.string().required(),
    province_id: Joi.number().required(),
    district_id: Joi.number().required(),
    ward_id: Joi.number().required()
};

const validateRules = {
    signUp: {
        body: ruleSignUp,
    },
    signUpSocial: {
        body: ruleSignUpSocial,
    },
    changePassword: {
        body: ruleChangePassword,
    },
    forgotPassword: {
        body: ruleForgotPassword
    },
    checkResetPass: {
        body: ruleCheckResetPass
    },
    resetPassword: {
        body: ruleResetPassword
    },
    updateProfile: {
        body: ruleUpdateProfile,
    },
};

module.exports = validateRules;
