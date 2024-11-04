const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    static_id: '{{#? STATICCONTENTID}}',
    static_code: '{{#? STATICCONTENTCODE}}',
    static_name: '{{#? STATICCONTENTNAME}}',
    order_index: '{{#? ORDERINDEX}}',
    description: '{{#? DESCRIPTION}}',
    includeintopmenu: '{{INCLUDEINTOPMENU ? 1 : 0}}',
    includeinfootercolumn1: '{{INCLUDEINFOOTERCOLUMN1 ? 1 : 0}}',
    includeinfootercolumn2: '{{INCLUDEINFOOTERCOLUMN2 ? 1 : 0}}',
    includeinfootercolumn3: '{{INCLUDEINFOOTERCOLUMN3 ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    language_id: '{{#? LANGUAGEID}}',
    keyword: '{{#? KEYWORD}}',
    meta_key_words: '{{#? METAKEYWORDS}}',
    meta_description: '{{#? METADESCRIPTION}}',
    meta_title: '{{#? METATITLE}}',
    seo_name: '{{#? SEONAME}}',
    gen_static_code: '{{#? GEN_STATIC_CODE}}',
    image_file_id: '{{#? IMAGEFILEID}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    image_url_en: [
        {
            '{{#if IMAGEURLEN}}': `${config.domain_cdn}{{IMAGEURLEN}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    static_name_en: '{{#? STATICCONTENTNAMEEN}}',
    description_en: '{{#? DESCRIPTIONEN}}',
    meta_key_words_en: '{{#? METAKEYWORDSEN}}',
    meta_description_en: '{{#? METADESCRIPTIONEN}}',
    meta_title_en: '{{#? METATITLEEN}}',
    seo_name_en: '{{#? SEONAMEEN}}',
    static_link_en: '{{#? STATICLINKEN}}',
    group_service_code: '{{#? GROUPSERVICECODE}}',
    static_link: '{{#? STATICLINK}}',
    order_index_en: '{{#? ORDERINDEXEN}}',
    keyword_en: '{{#? KEYWORDEN}}',

};

let transform = new Transform(template);


const list = (data = []) => {
    return transform.transform(data, [
        'static_id',
        'static_code',
        'static_name',
        'order_index',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'includeintopmenu',
        'includeinfootercolumn1',
        'includeinfootercolumn2',
        'includeinfootercolumn3',
        'keyword',
        'group_service_code',
        'language_id'
        
    ]);
};


const detail = data => {
    return transform.transform(data, [
        'static_id',
        'static_code',
        'static_name',
        'order_index',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'includeintopmenu',
        'includeinfootercolumn1',
        'includeinfootercolumn2',
        'includeinfootercolumn3',
        'language_id',
        'keyword',
        'meta_key_words',
        'meta_description',
        'meta_title',
        'seo_name',
        'image_url',
        'image_url_en',
        'keyword',
        'static_name_en',
        'description_en',
        'meta_key_words_en',
        'meta_description_en',
        'meta_title_en',
        'seo_name_en',
        'static_link_en',
        'group_service_code',
        'static_link',
        'order_index_en',
        'keyword_en'
    ]);
};

const StaticGenCode = data => {
    return transform.transform(data, ['gen_static_code']);
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
    StaticGenCode,
};
