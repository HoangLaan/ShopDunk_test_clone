const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    news_id: '{{#? NEWSID}}',
    news_title: '{{#? NEWSTITLE}}',
    news_date: '{{#? NEWSDATE}}',
    short_description: '{{#? SHORTDESCRIPTION}}',
    description: '{{#? DESCRIPTION}}',
    content: '{{#? CONTENT}}',
    is_video: '{{#? ISVIDEO}}',
    news_category_id: '{{#? NEWSCATEGORYID}}',
    news_category_name: '{{#? NEWSCATEGORYNAME}}',
    meta_key_words: '{{#? METAKEYWORDS}}',
    meta_description: '{{#? METADESCRIPTIONS}}',
    meta_title: '{{#? METATITLE}}',
    seo_name: '{{#? SEONAME}}',
    image_file_id: '{{#? IMAGEFILEID}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    image: [
        {
            '{{#if URLIMAGE}}': `${config.domain_cdn}{{URLIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    banner_url: [
        {
            '{{#if BANNERURL}}': `${config.domain_cdn}{{BANNERURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_high_light: '{{ISHIGHLIGHT ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_show_product_gift: '{{ISSHOWPRODUCTGIFT ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATED}}',
    parent_id: '{{#? PARENTID}}',
    avatar: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    username: '{{#? USERNAME}}',
    fullname: '{{#? FULLNAME}}',
    like_count: '{{#? LIKECOUNT}}',
    comment_id: '{{#? COMMENTID}}',
    comment_content: '{{#? COMMENTCONTENT}}',
    reply_comment_id: '{{#? REPLYTOCOMMENTID}}',
    author: '{{#? COMMENTUSER}}',
    username: '{{#? USERNAME}}',
    like_count: '{{#? LIKECOUNT}}',
    dislike_count: '{{#? DISLIKECOUNT}}',
    news_comment_like_id: '{{#? NEWSCOMMENTLIKEID}}',
    user_id_like: '{{#? USERLIKE}}',
    news_comment_dis_like_id: '{{#? NEWSCOMMENDISLIKEID}}',
    user_id_dis_like: '{{#? USERDISLIKE}}',
    is_delete: '{{ISDELETE ? 1 : 0 }}',
    is_edit: '{{ISEDIT ? 1 : 0 }}',
    is_like: '{{ISLIKE ? 1 : 0 }}',
    totalReply: '{{#? TOTALITEMS}}',
};

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        'reply_comment_id',
        'comment_id',
        'comment_content',
        'image',
        'author',
        'avatar',
        'username',
        'created_user',
        'created_date',
    ]);
};

const detailInside = data => {
    return transform.transform(data, [
        'news_id',
        'news_title',
        'news_date',
        'short_description',
        'description',
        'content',
        'news_category_name',
        'avatar',
        'fullname',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'reply_comment_id',
        'comment_id',
        'comment_content',
        'image',
        'author',
        'like_count',
        'avatar',
        'username',
        'created_user',
        'created_date',
        'news_comment_like_id',
        'is_like',
        'totalReply',
    ]);
};

const listReply = (data = []) => {
    return transform.transform(data, [
        'reply_comment_id',
        'comment_id',
        'comment_content',
        'image',
        'author',
        'like_count',
        'avatar',
        'username',
        'created_user',
        'created_date',
        'is_like',
        'totalReply',
        'news_comment_like_id',
    ]);
};

const CommentNearest = (data = []) => {
    return transform.transform(data, ['reply_comment_id']);
};

const listInside = (data = []) => {
    return transform.transform(data, [
        'news_id',
        'news_title',
        'news_category_name',
        'news_date',
        'image_url',
        'avatar',
        'fullname',
    ]);
};

const related = (data = []) => {
    return transform.transform(data, ['parent_id', 'news_id', 'news_title', 'news_category_name', 'created_date']);
};

module.exports = {
    list,
    detail,
    related,
    listInside,
    detailInside,
    CommentNearest,
    listReply,
};
