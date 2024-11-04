const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    category_name: '{{#? CATEGORYNAME}}',
    model_name: '{{#? MODELNAME}}',
    vat_value: '{{ VATVALUE ? VATVALUE: 0 }}',
    created_date: '{{#? CREATEDDATE}}',
    manufacture_name: '{{#? MANUFACTURERNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    unit_name: '{{#? UNITNAME}}',
    is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
    is_hot: '{{ISHOT ? 1 : 0}}',
    product_link: '{{#? PRODUCTLINK}}',
    unit_id: '{{#? UNITID}}',
    model_id: '{{#? MODELID }}',
    product_type: '{{#? PRODUCTTYPE }}'
};

const list = (products = []) => {
    let transform = new Transform(template);

    return transform.transform(products, [
        'product_id',
        'category_name',
        'model_name',
        'vat_value',
        'manufacture_name',
        'picture_url',
        'created_date',
        'is_active',
        'product_code',
        'product_name',
        'unit_name',
        'is_show_web',
        'unit_id',
        'model_id',
        'product_type'
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

const optionsStock = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        code: '{{#? STOCKSCODE}}',
        type_id: '{{#? STOCKTYPEID}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label', 'code', 'type_id']);
};

const optionsStockInRequest = (data = []) => {
    let transform = new Transform({
        stocks_in_requset_id: '{{#? STOCKSINREQUESTID}}',
        stocks_incode: '{{#? STOCKSINCODE}}',
        id: '{{#? STOCKSINREQUESTID}}',
        label: '{{#? STOCKSINCODE}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label', 'code', 'type_id']);
};

const optionsProduct = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name']);
}

const detail = (data = []) => {
    const transform = new Transform({
        ...template,
        ...{
            product_display_name: '{{#? PRODUCTDISPLAYNAME}}',
            product_category_id: {
                value: '{{#? PRODUCTCATEGORYID}}',
                label: '{{#? CATEGORYNAME}}',
            },
            manufacture_name: '{{#? MANUFACTURERNAME}}',
            product_category_name: '{{#? CATEGORYNAME}}',
            product_model_name: '{{#? MODELNAME}}',
            origin_id: {
                value: '{{#? ORIGINID}}',
                label: '{{#? ORIGINNAME}}',
            },
            model_id: {
                value: '{{#? MODELID}}',
                label: '{{#? MODELNAME}}',
            },
            manufacture_id: {
                value: '{{#? MANUFACTURERID}}',
                label: '{{#? MANUFACTURERNAME}}',
            },
            unit_id: {
                value: '{{#? UNITID}}',
                label: '{{#? UNITNAME}}',
            },
            warranty_period_id: [
                {
                    '{{#if WARRANTYPERIODID}}': {
                        value: '{{#? WARRANTYPERIODID}}',
                        label: '{{#? WARRANTYPERIODNAME}}',
                    },
                },
                {
                    '{{#else}}': null,
                },
            ],
            description: '{{#? DESCRIPTIONS}}',
            keypoints: '{{#? KEYPOINTS}}',
            is_half_link: '{{ISHALFLINK ? 1 : 0}}',
            is_stop_selling: '{{ISSTOPSELLING ? 1 : 0}}',
            stop_selling_from: '{{#? STOPSELLINGFROM}}',
            is_stock_tracking: '{{ISSTOCKTRACKING ? 1 : 0}}',
            product_link: '{{#? PRODUCTLINK}}',
        },
    });

    return transform.transform(data, [
        'product_id',
        'product_category_id',
        'model_id',
        'unit_id',
        'manufacture_id',
        'origin_id',
        'product_display_name',
        'product_code',
        'product_name',
        'is_active',
        'description',
        'keypoints',
        'warranty_period_id',
        'is_half_link',
        'is_stop_selling',
        'stop_selling_from',
        'is_stock_tracking',
        'is_show_web',
        'is_hot',
        'manufacture_name',
        'product_category_name',
        'product_model_name',
        'product_link',
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
    optionsStock,
    optionsProduct,
    detail,
    proAttribute,
    subUnitList,
    proStockInventory,
    proImages,
    productsBarcode,
    optionsStockInRequest,
};
