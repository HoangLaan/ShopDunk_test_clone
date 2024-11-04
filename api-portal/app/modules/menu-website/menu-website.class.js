const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    website_category_id: '{{#? WEBSITECATEGORYID}}',
    website_category_code: '{{#? WEBSITECATEGORYCODE}}',
    website_category_name: '{{#? WEBSITECATEGORYNAME}}',
    website_name: '{{#? WEBSITENAME}}',
    static_content_name: '{{#? STATICCONTENTNAME}}',
    product_category_name: '{{#? PRODUCTCATEGORYNAME}}',
    is_top_menu: '{{#? ISTOPMENU ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_footer: '{{#? ISFOOTER ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',
    next_code: '{{#? GEN_WEBSITE_CATEGORY_NEXT_CODE}}',
    order_index: '{{#? ORDERINDEX}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    parent_id: '{{#? PARENTID}}',
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    language_id: '{{#? LANGUAGEID}}',
    url: '{{#? URL}}',
    meta_title: '{{#? METATITLE}}',
    meta_keywords: '{{#? METAKEYWORDS}}',
    meta_description: '{{#? METADESCRIPTION}}',
    static_content_id: '{{#? STATICCONTENTID}}',
};

let transform = new Transform(template);

const defaultFields = [
    'website_category_id',
    'website_category_code',
    'website_category_name',
    'website_name',
    'product_category_name',
    'static_content_name',
    'is_top_menu',
    'is_footer',
    'is_active',
    'created_date',
    'order_index',
];

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'created_user',
        'parent_id',
        'language_id',
        'website_id',
        'product_category_id',
        'url',
        'meta_title',
        'meta_keywords',
        'meta_description',
        'static_content_id',
    ]);
};

const nextCode = (data) => {
    return transform.transform(data, ['next_code']);
};

// eslint-disable-next-line no-undef
module.exports = {
    list,
    detail,
    nextCode,
};
