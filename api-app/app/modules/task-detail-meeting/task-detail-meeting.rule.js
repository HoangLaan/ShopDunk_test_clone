const Joi = require('joi');
const validateRules = {
    getDetail: {
        params: {
            meeting_id: Joi.number().required(),
        },
    },
    getTaskWorkFlow: {
        query: {
            task_detail_id: Joi.number().required(),
        },
    },
    updateMeeting: {
        body: {
            // meeting_id: Joi.number().required(),
            // content_meeting: Joi.string().allow(null),
            is_coming: Joi.number().valid(0, 1).allow(null),
            task_work_flow_id: Joi.number().allow(null),
        },
    },
};

module.exports = validateRules;
