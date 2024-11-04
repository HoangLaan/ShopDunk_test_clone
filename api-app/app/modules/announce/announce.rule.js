const Joi = require('joi');

const ruleCreateOrUpdateComment = {
    comment_id: Joi.number().min(1).allow('', null).optional(),
    comment_content: Joi.string().allow('', null).optional(),
    reply_comment_id: Joi.number().min(1).allow('', null).optional(),
    announce_id: Joi.number().min(1).required(),
};

const validateRules = {
    global: {},
    getList: {
        page: Joi.number().min(1).required(),
        itemsPerPage: Joi.number().min(1).required(),
        search: Joi.string().allow('').optional(),
    },
    getDetail: {
        announce_id: Joi.number().min(1).required(),
    },

    getCommentList: {
        announce_id: Joi.number().min(1).required(),
    },
    getReplyCommentList: {
        reply_comment_id: Joi.number().min(1).required(),
    },
    createAnnounceComment: {
        body: ruleCreateOrUpdateComment,
    },
    updateAnnounceComment: {
        body: ruleCreateOrUpdateComment,
    },
    likeDislikeComment: {
        comment_id: Joi.number().min(1).required(),
        is_like: Joi.boolean().truthy(1).falsy(0).required(),
    },
};

module.exports = validateRules;
