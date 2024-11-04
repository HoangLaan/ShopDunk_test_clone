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
    is_system: '{{ISSYSTEM ? 1: 0}}',
    is_show_product_gift: '{{ISSHOWPRODUCTGIFT ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    parent_id: '{{#? PARENTID}}',
    avatar: [
        {
            '{{#if AVATAR}}': `${config.domain_cdn}{{AVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    username: '{{#? USERNAME}}',
    fullname: '{{#? FULLNAME}}',

    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    category_name: '{{#? CATEGORYNAME}}',
    model_name: '{{#? MODELNAME}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',

    is_inside: '{{ISINSIDE ? 1 : 0}}',
    is_magazine: '{{ISMAGAZINE ? 1 : 0}}',
    design_by: '{{#? DESIGNBY}}',
    content_writer: '{{#? CONTENTWRITER}}',
    news_type: '{{#? NEWSTYPE}}',
    news_title_cn: '{{#? NEWSTITLECN}}',
    short_description_cn: '{{#? SHORTDESCRIPTIONCN}}',
    content_cn: '{{#? CONTENTCN}}',
    is_show_home: '{{ISSHOWHOME ? 1 : 0}}',
    is_slide: '{{ISSLIDE ? 1 : 0}}',
    is_grateful: '{{ISGRATEFUL ? 1 : 0}}',
    meta_key_words_cn: '{{#? METAKEYWORDSCN}}',
    meta_description_cn: '{{#? METADESCRIPTIONSCN}}',
    meta_title_cn: '{{#? METATITLECN}}',
    seo_name_cn: '{{#? SEONAMECN}}',
    video_link: '{{#? VIDEOLINK}}',
    slug_url: '{{#? SLUGURL}}',
    view_count: '{{VIEWCOUNT ? VIEWCOUNT : 0}}',
    total_comment: '{{TOTALCOMMENT ? TOTALCOMMENT : 0}}',
};

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        'news_id',
        'news_title',
        'news_date',
        'short_description',
        'description',
        'content',
        'is_video',
        'news_category_id',
        'news_category_name',
        'meta_key_words',
        'meta_description',
        'meta_title',
        'seo_name',
        'image_url',
        'banner_url',
        'is_high_light',
        'is_active',
        'is_inside',
        'design_by',
        'content_writer',
        'news_title_cn',
        'short_description_cn',
        'content_cn',
        'is_show_home',
        'is_slide',
        'is_grateful',
        'meta_key_words_cn',
        'meta_description_cn',
        'meta_title_cn',
        'seo_name_cn',
        'video_link',
        'is_system',
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
        'news_id',
        'news_title',
        'news_category_name',
        'is_video',
        'created_user',
        'news_date',
        'created_user',
        'created_date',
        'is_active',
        'news_type',
        'slug_url',
        'view_count',
        'total_comment',
        'is_system'
    ]);
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
        'short_description',
    ]);
};

const related = (data = []) => {
    return transform.transform(data, [
        'news_id',
        'news_title',
        'news_category_name',
        'is_video',
        'created_user',
        'news_date',
        'created_user',
        'created_date',
        'is_active',
        'news_type',
        'slug_url',
        'view_count',
        'total_comment',
    ]);
};

const products = (data = []) => {
    return transform.transform(data, [
        'product_id',
        'news_id',
        'product_code',
        'product_name',
        'category_name',
        'model_name',
        'manufacturer_name',
    ]);
};
module.exports = {
    list,
    detail,
    related,
    listInside,
    detailInside,
    products,
};
