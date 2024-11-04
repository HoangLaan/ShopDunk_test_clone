const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    model_id: '{{#? MODELID}}',
    model_name: '{{#? MODELNAME}}',
    model_code: '{{#? MODELCODE}}',
    category_name: '{{#? CATEGORYNAME}}',
    display_name: '{{#? MODELDISPLAYNAME}}',
    product_category_id: '{{#? PRODUCTCATEGORYID + ""}}',
    created_date: '{{#? CREATEDDATE}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
    order_index: '{{#? ORDERINDEX}}',
    model_picture_id: '{{#? MODELPICTUREID}}',

    // DefaultAccount
    accounting_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
    accounting_account_name: '{{#? ACCOUNTINGACCOUNTNAME}}',
    accounting_account_code: '{{#? ACCOUNTINGACCOUNTCODE}}',
    product_model_default_account_id: '{{#? PRODUCTMODELDEFAULTACCOUNTID}}',
    type: '{{#? TYPE}}',
    product_model_id: '{{#? PRODUCTMODELID}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'model_id',
        'model_name',
        'model_code',
        'category_name',
        'product_category_id',
        'is_active',
        'created_date',
        'picture_url',
        'display_name',
        'is_show_web',
    ]);
};

const accountingOptions = (data = []) => {
    return transform.transform(data, ['accounting_account_id', 'accounting_account_name', 'accounting_account_code']);
};

const detail = (data) => {
    return transform.transform(data, [
        'model_id',
        'model_code',
        'model_name',
        'display_name',
        'order_index',
        'product_category_id',
        'description',
        'is_active',
        'is_show_web',
    ]);
};

const listImages = (data = []) => {
    return transform.transform(data, ['picture_url', 'model_picture_id']);
};

const listAttributes = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label']);
};

const attributeDetail = (data) => {
    let transform = new Transform({
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        unit_name: '{{#? UNITNAME}}',
    });
    return transform.transform(data, ['product_attribute_id', 'unit_name']);
};

const listDefaultAttributeValue = (data = []) => {
    let transform = new Transform({
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        value: '{{#? ATTRIBUTEVALUESID}}',
        label: '{{#? ATTRIBUTEVALUES}}',
    });
    return transform.transform(data, ['product_attribute_id', 'value', 'label']);
};

const listProduct = (data = []) => {
    let transform = new Transform({
        model_id: '{{#? MODELID}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',
        attribute_values: '{{#? ATTRIBUTEVALUES}}',
        unit_id: '{{#? UNITID}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        is_default: '{{ISDEFAULT ? 1 : 0}}',
        warranty_period_id: '{{#? WARRANTYPERIODID}}',
    });
    return transform.transform(data, [
        'model_id',
        'product_id',
        'product_code',
        'product_name',
        'product_attribute_id',
        'attribute_values_id',
        'attribute_values',
        'unit_id',
        'is_active',
        'is_default',
        'warranty_period_id',
    ]);
};

const listDefaultAccounts = (data = []) => {
    return transform.transform(data, [
        'product_model_default_account_id',
        'product_model_id',
        'accounting_account_id',
        'type',
    ]);
};

const listProductImages = (data = []) => {
    let transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        is_default: '{{ISDEFAULT ? 1 : 0}}',
        picture_url: [
            {
                '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    });
    return transform.transform(data, ['product_id', 'picture_url', 'is_active', 'is_default']);
};

const listDAByModelId = (data = []) => {
    return transform.transform(data, ['product_model_default_account_id', 'accounting_account_id']);
};

module.exports = {
    list,
    detail,
    listAttributes,
    listImages,
    attributeDetail,
    listDefaultAttributeValue,
    listProduct,
    accountingOptions,
    listDefaultAccounts,
    listDAByModelId,
    listProductImages,
};
