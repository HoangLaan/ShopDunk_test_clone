const Joi = require('joi');

const ruleCreateOrUpdate = {
    task_type_id: Joi.number().required(),
    task_name: Joi.string().required(),

    company_id: Joi.number().required(),
    department_id: Joi.number().required(),
    supervisor_user: Joi.string().required(),
    staff_user: Joi.string().required(),

    member_list: Joi.array()
        .items(
            Joi.object({
                member_id: Joi.number().allow(null),
                data_leads_id: Joi.number().allow(null),
            }).or('member_id', 'data_leads_id'),
        )
        .min(1)
        .required(),

    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    create: {
        body: ruleCreateOrUpdate,
    },
    update: {
        body: ruleCreateOrUpdate,
    },

    createCareComment: {
        body: {
            task_detail_id: Joi.number().required(),
            member_id: Joi.number().allow(null),
            data_leads_id: Joi.number().allow(null),
            workflow_id: Joi.number().required(),
            content_comment: Joi.string().required(),
        },
    },

    updateInterestContent: {
        body: {
            task_detail_id: Joi.number().required(),
            member_id: Joi.number().allow(null),
            data_leads_id: Joi.number().allow(null),
            // workflow_id: Joi.number().required(),
            // content_comment: Joi.string().required(),
        },
    },

    createSMSCustomer: {
        body: {
            task_detail_id: Joi.number().required(),
            content_sms: Joi.string().required(),
            member_id: Joi.number().allow(null),
            data_leads_id: Joi.number().allow(null),
            phone_number: Joi.string().required(),
            brandname: Joi.string().required(),
            // task_schedule_id: Joi.number().required(),
            // status: Joi.string().required(),
            // is_sent: Joi.number().required(),
            // error_msg: Joi.string().required(),
        },
    },
    createCallCustomer: {
        body: {
            //task_detail_id: Joi.number().required(),
            sip_id: Joi.string().required()
            //username: Joi.string().required(),
            //member_id: Joi.number().allow(null),
            //data_leads_id: Joi.string().allow(null),
            //call_type_id: Joi.number().required(),
            //datetime_from: Joi.string().required(),
            //datetime_to: Joi.string().required(),
            //duration: Joi.number().required(),
            //call_subject: Joi.string().required(),
            //content_call: Joi.string().required(),
        },
    },
    createMeetingCustomer: {
        body: {
            task_detail_id: Joi.number().required(),
            username: Joi.string().required(),
            member_id: Joi.number().allow(null),
            data_leads_id: Joi.string().allow(null),
            datetime_from: Joi.string().allow(null, ''),
            datetime_to: Joi.string().allow(null, ''),
            appointment_subject: Joi.string().required(),
            content_appointment: Joi.string().required(),
            location: Joi.string().allow(null, ''),
        },
    },

    changeWorkFlow: {
        body: {
            task_detail_id: Joi.number().required(),
            task_workflow_id: Joi.number().required(),
            //task_workflow_old_id: Joi.number(),
        },
    },
};

module.exports = validateRules;
