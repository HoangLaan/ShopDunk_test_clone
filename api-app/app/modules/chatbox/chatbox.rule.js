const Joi = require('joi');

const validateRules = {
    createGroupConversation: {
        body: Joi.object().keys({
            conversation_name: Joi.string().required(),
            avatar: Joi.string().allow(null, ''),
            password: Joi.string().allow(null, ''),
            description: Joi.string().allow(null, ''),
            user_list: Joi.array().items(Joi.string()).min(1),
        }),
    },

    addGroupParticipant: {
        body: Joi.object().keys({
            conversation_id: Joi.number().required(),
            user_list: Joi.array().items(Joi.string()).min(1),
        }),
    },

    pinConversation: {
        body: Joi.object().keys({
            cs_participant_id: Joi.number().required(),
            is_pin: Joi.number().allow(0, 1).required(),
        }),
    },

    updateConversation: {
        body: Joi.object().keys({
            conversation_id: Joi.number().required(),
            conversation_name: Joi.string().required(),
            avatar: Joi.string().allow(null, ''),
            password: Joi.string().allow(null, ''),
            description: Joi.string().allow(null, ''),
        }),
    },

    sendMessage: {
        body: Joi.object().keys({
            conversation_id: Joi.number().allow(null, ''),
            username: Joi.string().when('conversation_id', {
                is: Joi.exist(),
                then: Joi.allow(null, ''),
                otherwise: Joi.required(),
            }),
            // files: Joi.array().items(
            //     Joi.object().keys({
            //         path: Joi.string().empty('').required(),
            //         name: Joi.string().empty('').required(),
            //     }),
            // ),
            message: Joi.string(),
            // .empty('')
            // .when('file', {
            //     is: Joi.array().min(1),
            //     then: Joi.allow(null, ''),
            //     otherwise: Joi.required(),
            // }),
            parent_id: Joi.string().allow(null, ''),
        }),
    },
};

module.exports = validateRules;
