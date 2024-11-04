const Joi = require('joi');

const ruleCreateOrUpdate = {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.number().valid(0, 1).required(),
    birthday: Joi.string().regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
    email: Joi.string().email().required(),
    phone_number_1: Joi.string().allow('', null),
    phone_number: Joi.string(),
    // address: Joi.string(),
    // province_id: Joi.number(),
    // district_id: Joi.number(),
    // country_id: Joi.number(),
    // city_id: Joi.number(),
    description: Joi.string().allow('', null),
    // default_picture_url: Joi.string().allow('', null),
    department_id: Joi.number().required(),
    position_id: Joi.number(),
    about_me: Joi.string().allow('', null),
    entry_date: Joi.string()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)
        .allow('', null),
    indentity_date: Joi.string()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)
        .allow('', null),
    user_status: Joi.number().valid(1, 2, 3).required(),
    block_id: Joi.number().required(),
    nation_id: Joi.number().allow('', null),
};

const ruleResetPassword = {
    password: Joi.string().required(),
    password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .error((errors) => {
            return errors.map((error) => {
                switch (error.type) {
                    case 'any.allowOnly':
                        return { message: 'Xác nhận mật khẩu không trùng khớp.' };
                }
            });
        }),
};
const ruleChangePasswordUser = {
    old_password: Joi.string().required(),
    new_password: Joi.string().required().min(8),
    re_password: Joi.string().required().min(8).valid(Joi.ref('new_password')),
};

const validateRules = {
    createUser: {
        body: Object.assign({}, ruleCreateOrUpdate, {
            password: Joi.string().required(),
        }),
    },
    updateUser: {
        body: ruleCreateOrUpdate,
    },
    resetPassword: {
        body: ruleResetPassword,
    },
    changePasswordUser: {
        body: ruleChangePasswordUser,
    },
    deleteUser: {
        body: {
            ids: Joi.array().required().min(1),
        },
    },
};

module.exports = validateRules;
