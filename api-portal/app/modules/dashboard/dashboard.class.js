const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');
const template = {
    total_revenue_quarter_before: '{{TOTALREVENUEOFQUARTERBEFORE ? TOTALREVENUEOFQUARTERBEFORE : 0}}',
    total_revenue_quarter_now: '{{TOTALREVENUEOFQUARTERNOW ? TOTALREVENUEOFQUARTERNOW : 0}}',

    total_commission_quarter_now: '{{TOTALCOMMISSIONQUARTERNOW ? TOTALCOMMISSIONQUARTERNOW : 0}}',
    total_commission_quarter_before: '{{TOTALCOMMISSIONQUARTERBEFORE ? TOTALCOMMISSIONQUARTERBEFORE : 0}}',

    total_goods_quarter_now: '{{TOTALGOODSQUARTERNOW ? TOTALGOODSQUARTERNOW : 0}}',
    total_goods_quarter_before: '{{TOTALGOODSQUARTERBEFORE ? TOTALGOODSQUARTERBEFORE : 0}}',

    total_order_quarter_now: '{{TOTALORDERQUARTERNOW ? TOTALORDERQUARTERNOW : 0}}',
    total_order_quarter_before: '{{TOTALORDERQUARTERBEFORE ? TOTALORDERQUARTERBEFORE : 0}}',

    total_off_work: '{{TOTALOFFWORK ? TOTALOFFWORK : 0}}',

    mail_subject: '{{#? MAILSUBJECT}}',
    mail_id: '{{#? MAILID}}',
    parent_id: '{{#? PARENTID}}',
    create_date: '{{#? SENDDATE}}',
    user_name: '{{#? USERNAME}}',
    create_user: '{{#? CREATEDUSER}}',
    is_read: '{{ISREAD ? 1 : 0}}',
    is_draft: '{{ISDRAFT ? 1 : 0}}',
    is_flagged: '{{ISFLAGGED ? 1 : 0}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',

    is_attachment: '{{ISATTACHMENT ? 1 : 0}}',
    announce_title: '{{#? ANNOUNCETITLE}}',
    announce_desc: '{{#? DESCRIPTION}}',
    announce_id: '{{#? ANNOUNCEID}}',
    attachment_name: '{{#? ATTACHMENTNAME}}',
    user_fullname: '{{#? FULLNAME}}',

    published_date: '{{#? PUBLISHEDDATE}}',
    total_view: '{{#? TOTALVIEW}}',

    news_category_id: '{{#? NEWSCATEGORYID}}',
    news_category_name: '{{#? NEWSCATEGORYNAME}}',
    birthday: '{{#? BIRTHDAY}}',

    news_id: '{{#? NEWSID}}',
    news_title: '{{#? NEWSTITLE}}',
    img_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    user_img_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    attachment_path: [
        {
            '{{#if ATTACHMENTPATH}}': `${config.domain_cdn}{{ATTACHMENTPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_video: '{{ISVIDEO ? 1 : 0}}',
    seo_name: '{{#? SEONAME}}',
    news_date: '{{#? NEWSDATE}}',
    short_desc: '{{#? SHORTDESCRIPTION}}',
    count_not_read: '{{#? TOTALITEMS}}',
    is_reply: '{{#? ISREPLY}}',

    product_name: '{{#? PRODUCTNAME}}',
    total: '{{#? TOTAL}}',
    category_name: '{{#? CATEGORYNAME}}',
    total_debit_payment: '{{#? TOTALDEBITPAYMENT}}',
    total_debit_receive: '{{#? TOTALDEBITRECEIVE}}',
};

let transform = new Transform(template);

const detailDebit = (data = []) => transform.transform(data, ['total_debit_payment', 'total_debit_receive']);

const listStock = (data = []) => transform.transform(data, ['product_name', 'total', 'category_name']);

const summary = (datas = []) => {
    return transform.transform(datas, [
        'total_revenue_quarter_before',
        'total_revenue_quarter_now',
        'total_commission_quarter_now',
        'total_commission_quarter_before',
        'total_goods_quarter_now',
        'total_goods_quarter_before',
        'total_off_work',
        'total_order_quarter_now',
        'total_order_quarter_before',
    ]);
};

const listNews = (data = []) => {
    return transform.transform(data, [
        'news_category_id',
        'news_category_name',
        'news_id',
        'news_title',
        'img_url',
        'is_video',
        'news_date',
        'seo_name',
        'short_desc',
        'create_user',
        'user_img_url',
        'user_fullname',
    ]);
};
const listMail = (mails = []) => {
    const template = {
        mail_id: '{{#? MAILID}}',
        parent_id: '{{#? PARENTID}}',
        mail_subject: '{{#? MAILSUBJECT}}',
        mail_content: '{{#? MAILCONTENT}}',
        create_date: '{{#? SENDDATE}}',
        is_read: '{{ISREAD ? 1 : 0}}',
        is_flagged: '{{ISFLAGGED ? 1 : 0}}',
        is_attachment: '{{ISATTACHMENT ? 1 : 0}}',
        total_mail: '{{TOTALMAIL ? TOTALMAIL : 0}}',
        user_fullname: '{{#? SENDERFULLNAME}}',
        user_img_url: [
            {
                '{{#if SENDERAVATAR}}': `${config.domain_cdn}{{SENDERAVATAR}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        user_receive: '{{#? SENDTO}}',
        create_user: '{{#? CREATEDUSER}}',
        is_send_by_me: '{{ISSENDBYME ? 1 : 0}}',
    };
    const transform = new Transform(template);
    return transform.transform(mails, [
        'mail_id',
        'parent_id',
        'mail_subject',
        'mail_content',
        'create_date',
        'is_attachment',
        'is_read',
        'is_flagged',
        'user_fullname',
        'user_img_url',
        'total_mail',
    ]);
};
const listAnnounce = (data = []) => {
    return transform.transform(data, [
        'announce_id',
        'announce_title',
        'announce_desc',
        'user_fullname',
        'user_img_url',
        'published_date',
        'total_view',
        'is_read',
    ]);
};
const listAttachment = (data = []) => {
    return transform.transform(data, ['attachment_path', 'attachment_name']);
};
const count_not_read = (users = []) => {
    return transform.transform(users, ['count_not_read']);
};

module.exports = {
    summary,
    listNews,
    listAnnounce,
    listMail,
    listAttachment,
    count_not_read,
    listStock,
    detailDebit,
};
