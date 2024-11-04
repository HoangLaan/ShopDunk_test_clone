const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    group_service_id: '{{#? GROUPSERVICEID}}',
    group_service_name: '{{#? GROUPSERVICENAME}}',
    group_service_code: '{{#? GROUPSERVICECODE}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{#? ISACTIVE ? 1 : 0}}',
    order_index: '{{ORDERINDEX}}',
    created_user: '{{CREATEDUSER}}',
    created_date: '{{CREATEDDATE}}',
    updated_user: '{{UPDATEDUSER}}',
    updated_date: '{{UPDATEDDATE}}',
    language_id: '{{LANGUAGEID}}',
    language_name: '{{LANGUAGENAME}}',
    is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
    parent_id: '{{PARENTID}}',
    step: '{{STEP}}',
    seo_name: '{{SEONAME}}',
    meta_title: '{{METATITLE}}',
    meta_description: '{{METADESCRIPTION}}',
    meta_key_words: '{{METAKEYWORDS}}',
    parent_group_service_name: '{{PARENTGROUPSERVICENAME}}',

    small_images: [[
        {
            '{{#if SMALLIMAGEURL}}': `{{SMALLIMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ]],
    medium_images: [[
        {
            '{{#if MEDIUMIMAGEURL}}': `{{MEDIUMIMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ]],
    large_images: [[
        {
            '{{#if LARGEIMAGEURL}}': `{{LARGEIMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ]],
    seo_name_en: '{{#? SEONAMEEN}}',
    meta_title_en: '{{#? METATITLEEN}}',
    meta_description_en: '{{#? METADESCRIPTIONEN}}',
    meta_key_words_en: '{{#? METAKEYWORDSEN}}',
    group_service_name_en: '{{#? GROUPSERVICENAMEEN}}',
    steps: '{{#? STEP}}',
};

const list = (data = []) => {
    let transform = new Transform(template);

    return transform.transform(data, [
        'group_service_id',
        'group_service_name',
        'group_service_code',
        'parent_group_service_name',
        'created_date',
        'created_user',
        'is_active',
        'is_show_web'
    ]);
};

const listAttributes = (data = []) => {
    let transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        description: '{{#? ATTRIBUTEDESCRIPTION}}',
        unit_name: '{{#? UNITNAME}}',
        attribute_type: '{{#? ATTRIBUTETYPE}}',
    });
    return transform.transform(data, ['attribute_id', 'attribute_name', 'description', 'unit_name', 'attribute_type']);
};

const listAttributeValues = (data = []) => {
    let transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['attribute_id', 'id', 'name', 'value', 'label']);
};

const options = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        code: '{{#? CODE}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label', 'code']);
};

const optionsProduct = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name']);
}

const detail = data => {
    const transform = new Transform({
        group_service_id: '{{#? GROUPSERVICEID}}',
        group_service_name: '{{#? GROUPSERVICENAME}}',
        group_service_code: '{{#? GROUPSERVICECODE}}',
        parent_group_service_code: '{{#? PARENTGROUPSERVICECODE}}',
        order_index: '{{#? ORDERINDEX}}',
        seo_name: '{{#? SEONAME}}',
        meta_title: '{{#? METATITLE}}',
        meta_description: '{{#? METADESCRIPTION}}',
        meta_key_words: '{{#? METAKEYWORDS}}',
        description: '{{#? DESCRIPTION}}',
        large_images: [[
            {
                '{{#if LARGEIMAGEURL}}': `${config.domain_cdn}{{LARGEIMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ]],
        medium_images: [[
            {
                '{{#if MEDIUMIMAGEURL}}': `${config.domain_cdn}{{MEDIUMIMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ]],
        small_images: [[
            {
                '{{#if SMALLIMAGEURL}}': `${config.domain_cdn}{{SMALLIMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ]],
        is_active: '{{ISACTIVE ? 1 : 0}}',
        is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
        parent_id: '{{#? PARENTID}}',
        seo_name_en: '{{#? SEONAMEEN}}',
        meta_title_en: '{{#? METATITLEEN}}',
        meta_description_en: '{{#? METADESCRIPTIONEN}}',
        meta_key_words_en: '{{#? METAKEYWORDSEN}}',
        group_service_name_en: '{{#? GROUPSERVICENAMEEN}}',
        steps: '{{#? STEP}}',
    });

    return transform.transform(data, [
        'group_service_id',
        'group_service_name',
        'group_service_code',
        'order_index',
        'seo_name',
        'meta_title',
        'meta_description',
        'meta_key_words',
        'description',
        'large_images',
        'medium_images',
        'small_images',
        'is_active',
        'is_show_web',
        'parent_id',
        'seo_name_en',
        'meta_title_en',
        'meta_description_en',
        'meta_key_words_en',
        'group_service_name_en',
        'steps'
    ]);
};

const proAttribute = (data = []) => {
    const transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        unit_name: '{{#? UNITNAME}}',
        value: {
            value: '{{#? ATTRIBUTEVALUESID*1}}',
            label: '{{#? ATTRIBUTEVALUES}}',
        },
    });

    return transform.transform(data, ['attribute_id', 'attribute_name', 'unit_name', 'value']);
};

const subUnitList = (data = []) => {
    const transform = new Transform({
        product_sub_unit_id: '{{#? PRODUCTSUBUNITID}}',
        sub_unit_id: '{{#? SUBUNITID}}',
        main_unit_id: '{{#? MAINUNITID}}',
        density_value: '{{#? DENSITYVALUE}}',
        note: '{{#? NOTE}}',
    });

    return transform.transform(data, ['product_sub_unit_id', 'sub_unit_id', 'main_unit_id', 'density_value', 'note']);
};

const proStockInventory = (data = []) => {
    const transform = new Transform({
        pro_inventory_id: '{{#? PROINVENTORYID}}',
        date_from: '{{#? DATEFROM}}',
        date_to: '{{#? DATETO}}',
        quantity_in_stock_min: '{{QUANTITYINSTOCKMIN ? QUANTITYINSTOCKMIN : 0}}',
        quantity_in_stock_max: '{{QUANTITYINSTOCKMAX ? QUANTITYINSTOCKMAX : 0}}',
        unit_id: '{{#? parseInt(UNITID)}}',
        is_force_out: '{{ISFORCEOUT ? 1 : 0}}',
        max_storage_time: '{{MAXSTORAGETIME ? MAXSTORAGETIME : 0}}',
        store_id: '{{#? parseInt(STOREID)}}',
        stock_type_id: '{{#? parseInt(STOCKTYPEID)}}',
        pro_inventory_type: '{{#? PROINVENTORYTYPE}}',
    });

    return transform.transform(data, [
        'pro_inventory_id',
        'date_from',
        'date_to',
        'quantity_in_stock_min',
        'quantity_in_stock_max',
        'unit_id',
        'is_force_out',
        'max_storage_time',
        'store_id',
        'stock_type_id',
        'pro_inventory_type',
    ]);
};

const proImages = (data = []) => {
    let transform = new Transform({
        ...template,
        ...{
            is_default: '{{ ISDEFAULT ? 1 : 0}}',
        },
    });
    return transform.transform(data, ['picture_url', 'is_default']);
};

const productsBarcode = (products = []) => {
    let transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        price: '{{#? PRICE}}',
        category_name: '{{#? CATEGORYNAME}}',
        unit_name: '{{#? UNITNAME}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        imeis: '{{#? IMEIS}}',
    });

    return transform.transform(products, [
        'product_id',
        'product_name',
        'product_code',
        'price',
        'picture_url',
        'category_name',
        'unit_name',
        'manufacture_name',
        'imeis',
    ]);
};

module.exports = {
    list,
    listAttributes,
    listAttributeValues,
    options,
    optionsProduct,
    detail,
    proAttribute,
    subUnitList,
    proStockInventory,
    proImages,
    productsBarcode,
};
