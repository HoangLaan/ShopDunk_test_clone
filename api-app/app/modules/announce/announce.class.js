const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    announce_id: '{{#? ANNOUNCEID}}',
    announce_title: '{{#? ANNOUNCETITLE}}',
    announce_content: '{{#? ANNOUNCECONTENT}}',
    published_date: '{{#? PUBLISHEDDATE}}',
    total_view: '{{TOTALVIEW ? TOTALVIEW : 0}}',
    is_read: '{{ISREAD ? 1 : 0}}',
    fullname: '{{#? FULLNAME}}',

    user_id: '{{#? USERID}}',
    attachment_title: '{{#? ATTACHMENTTITLE}}',
    attachment_path: `${config.domain_cdn}{{ATTACHMENTPATH}}`,
    attachment_name: '{{#? ATTACHMENTNAME}}',
    sender: '{{#? SENDER}}',
    department_sent: '{{#? DEPARTMENTSENT}}',
    user_view_name: '{{#? USERVIEWNAME}}',
    department_view_name: '{{#? DEPARTMENTVIEWNAME}}',
    default_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': `${config.domain_cdn}/uploads/d-book.png`,
        },
    ],
    total_user_view: '{{TOTALUSERVIEW ? TOTALUSERVIEW : 0}}',
    total_user_comment: '{{TOTALUSERCOMMENT ? TOTALUSERCOMMENT : 0}}',

    image: [
        {
            '{{#if URLIMAGE}}': `${config.domain_cdn}{{URLIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATECONVERT}}',
    avatar: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    username: '{{#? USERNAME}}',
    like_count: '{{LIKECOUNT ? LIKECOUNT : 0}}',
    comment_id: '{{#? COMMENTANNOUNCEID}}',
    comment_content: '{{#? COMMENTCONTENT}}',
    reply_comment_id: '{{#? REPLYTOCOMMENTID}}',
    username: '{{#? USERNAME}}',
    is_like: '{{ISLIKE ? 1 : 0}}',
    total_reply: '{{TOTALREPLY ? TOTALREPLY : 0}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'announce_id',
        'announce_title',
        'announce_content',
        'published_date',
        'is_read',
        'total_view',
        'fullname',
    ]);
};

const detail = (data = []) => {
    return transform.transform(data, [
        'announce_id',
        'announce_title',
        'announce_content',
        'sender',
        'department_sent',
        'published_date',
        'total_user_view',
        'total_user_comment',
    ]);
};

const attachment = (data = []) => {
    return transform.transform(data, ['attachment_title', 'attachment_path', 'attachment_name']);
};

const listUserView = (data = []) => {
    return transform.transform(data, ['user_id', 'user_view_name', 'department_view_name', 'default_picture_url']);
};

const commentList = (data = []) => {
    return transform.transform(data, [
        'comment_id',
        'comment_content',
        'image',
        'like_count',
        'avatar',
        'username',
        'created_user',
        'created_date',
        'is_like',
        'total_reply',
    ]);
};

const replyCommentList = (data = []) => {
    return transform.transform(data, [
        'reply_comment_id',
        'comment_id',
        'comment_content',
        'image',
        'like_count',
        'avatar',
        'username',
        'created_user',
        'created_date',
        'is_like',
    ]);
};

module.exports = {
    list,
    detail,
    attachment,
    listUserView,
    commentList,
    replyCommentList,
};
