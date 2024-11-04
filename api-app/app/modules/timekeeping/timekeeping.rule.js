const Joi = require('joi');

const validateRules = {
    global: {},
    checkInOrCheckOut: {
        picture_base64: Joi.string().required(),
    },
    getStatiticsTimeKeeping: {
        timekeeping_from_date: Joi.string().required(),
        timekeeping_to_date: Joi.string().required(),
    },
    getListTimeKeeping: {
        timekeeping_from_date: Joi.string().required(),
        timekeeping_to_date: Joi.string().required(),
        page: Joi.number().optional(),
        itemsPerPage: Joi.number().optional(),
    },
};

module.exports = validateRules;
