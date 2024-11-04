const Joi = require('joi');

const ruleCreateOrUpdate = {
    news_title: Joi.string().required(),
    news_date: Joi.string().required(),
    short_description: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    content: Joi.string().allow('', null),
    author_full_name: Joi.string().allow('', null),
    news_source: Joi.string().allow('', null),
    is_video: Joi.number().valid(0, 1).required(),
    video_link: Joi.string().allow('', null),
    news_status_id: Joi.number().allow(null),
    news_category_id: Joi.number().required(),
    news_tag: Joi.string().allow('', null),
    meta_key_words: Joi.string().allow('', null),
    meta_description: Joi.string().allow('', null),
    meta_title: Joi.string().allow('', null),
    seo_name: Joi.string().allow('', null),
    image_file_id: Joi.number().allow(null),
    image_url: Joi.string().allow('', null),
    small_thumbnail_image_file_id: Joi.string().allow('', null),
    small_thumbnail_image_url: Joi.string().allow('', null),
    medium_thumbnail_image_file_id: Joi.string().allow('', null),
    medium_thumbnail_image_url: Joi.string().allow('', null),
    large_thumbnail_image_file_id: Joi.string().allow('', null),
    large_thumbnail_image_url: Joi.string().allow('', null),
    xlarge_thumbnail_image_file_id: Joi.string().allow('', null),
    xlarge_thumbnail_image_url: Joi.string().allow('', null),
    view_count: Joi.number().required(),
    comment_count: Joi.number().required(),
    like_count: Joi.number().required(),
    order_index: Joi.number().required(),
    is_show_home: Joi.number().valid(0, 1).allow(null),
    is_high_light: Joi.number().valid(0, 1).required(),
    is_show_notify: Joi.number().valid(0, 1).allow(null),
    is_hot_news: Joi.number().valid(0, 1).required(),
    is_active: Joi.number().valid(0, 1).required(),
    is_system: Joi.number().valid(0, 1).required(),
};

const validateRules = {
    createNews: {
        body: ruleCreateOrUpdate,
    },
    updateNews: {
        body: ruleCreateOrUpdate,
    },
    changeStatusNews: {
        body: {
            is_active: Joi.number().valid(0, 1).required(),
        },
    },
    getDetail: {
        news_id: Joi.number().min(1).required(),
    },
};

module.exports = validateRules;
