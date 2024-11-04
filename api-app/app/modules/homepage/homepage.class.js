const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    announce_id: '{{#? ANNOUNCEID}}',
    announce_title: '{{#? ANNOUNCETITLE}}',
    description: '{{#? DESCRIPTION}}',
    published_date: '{{#? PUBLISHEDDATE}}',
    created_date: '{{#? CREATEDDATE}}',
    total_view: '{{TOTALVIEW ? TOTALVIEW : 0}}',
    is_read: '{{ISREAD ? ISREAD : 0}}',
    fullname: '{{#? FULLNAME}}',
    created_user: '{{#? CREATEDUSER}}',

    attachment_path: [
        {
            '{{#if ATTACHMENTPATH}}': `${config.domain_cdn.slice(0, -1)}{{ATTACHMENTPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    attachment_name: '{{#? ATTACHMENTNAME}}',
    announce_attachment_id: '{{#? ANNOUNCEATTACHMENTID}}',

    mail_id: '{{#? MAILID}}',
    parent_id: '{{#? PARENTID}}',
    mail_subject: '{{#? MAILSUBJECT}}',
    mail_content: '{{#? MAILCONTENT}}',
    senddate: '{{#? SENDDATE}}',
    is_attachment: '{{ISATTACHMENT ? 1 : 0}}',
    is_read: '{{ISREAD ? 1 : 0}}',
    is_flagged: '{{ISFLAGGED ? 1 : 0}}',
    full_name: '{{#? SENDERFULLNAME}}',
    default_picture: [
        {
            '{{#if SENDERAVATAR}}': `${config.domain_cdn}{{SENDERAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    total_mail: '{{TOTALMAIL ? TOTALMAIL : 0}}',

    news_id: '{{#? NEWSID}}',
    news_title: '{{#? NEWSTITLE}}',
    news_category_name: '{{#? NEWSCATEGORYNAME}}',
    news_date: '{{#? NEWSDATE}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    avatar: [
        {
            '{{#if AVATAR}}': `${config.domain_cdn}{{AVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    fullname: '{{#? FULLNAME}}',
    short_description_cn: '{{#? SHORTDESCRIPTIONCN}}',

    order: {
        total_order: '{{ORDERCURRENTMONTH ? ORDERCURRENTMONTH : 0}}',
        growth_rate_order: '{{GROWTHRATEORDER ? GROWTHRATEORDER : 0}}',
    },
    member: {
        total_member: '{{TOTALMEMBER ? TOTALMEMBER : 0}}',
        growth_rate_member: '{{GROWTHRATEMEMBER ? GROWTHRATEMEMBER : 0}}',
    },
    day_off_work: {
        total_time: '{{TOTALTIME ? TOTALTIME : 0}}',
        total_time_off: '{{TOTALTIMEOFF ? TOTALTIMEOFF : 0}}',
        time_can_off: '{{TIMECANOFF ? TIMECANOFF : 0}}',
    },
};

let transform = new Transform(template);

const statisticalData = (data = {}) => {
    return transform.transform(data, ['order', 'member', 'day_off_work']);
};

const listAnnounce = (list = []) => {
    return transform.transform(list, [
        'announce_id',
        'announce_title',
        'description',
        'published_date',
        'created_date',
        'total_view',
        'is_read',
        'fullname',
        'created_user',
    ]);
};

const listAnnounceAttachment = (list = []) => {
    return transform.transform(list, ['attachment_path', 'attachment_name', 'announce_id']);
};

const listMail = (mails = []) => {
    return transform.transform(mails, [
        'mail_id',
        'parent_id',
        'mail_subject',
        'mail_content',
        'senddate',
        'is_attachment',
        'is_read',
        'is_flagged',
        'full_name',
        'default_picture',
        'total_mail',
    ]);
};

const listMailAttachment = (attachments = []) => {
    return transform.transform(attachments, ['attachment_path', 'attachment_name', 'mail_id']);
};

const listNews = (data = []) => {
    return transform.transform(data, [
        'news_id',
        'news_title',
        'news_category_name',
        'news_date',
        'image_url',
        'avatar',
        'fullname',
        'short_description',
    ]);
};

module.exports = {
    statisticalData,
    listAnnounce,
    listAnnounceAttachment,
    listMail,
    listMailAttachment,
    listNews,
};
