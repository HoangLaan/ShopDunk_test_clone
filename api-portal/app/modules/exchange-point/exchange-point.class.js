const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    ex_point_id: '{{#? EXPOINTID}}',
    ex_point_name: '{{#? EXPOINTNAME}}',
    value: '{{#? VALUE}}',
    point: '{{#? POINT}}',
    description: '{{#? DESCRIPTION}}',
    is_all_member_type: '{{ISALLMEMBERTYPE ? 1 : 0}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    max_ex_point: '{{#? MAXEXPOINT}}',
    applied_after: '{{#? APPLIEDAFTER}}',
    is_apply_all_category: '{{ISAPPLYALLCATEGORY ? 1 : 0  }}',
    is_exchange_point_to_money: '{{ISEXCHANGEPOINTTOMONEY ? 1 : 0  }}',
    is_apply_website: '{{ISAPPLYWEBSITE ? 1 : 0  }}',
    applied_date_from: '{{#? APPLIEDDATEFROM}}',
    applied_date_to: '{{#? APPLIEDDATETO}}',
    //PT_EXCHANGEPOINT_STORE
    ex_point_store_id: '{{#? EXPOINTSTOREID}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    address: '{{#? ADDRESS}}',
    //PT_EXCHANGEPOINT_CUSTOMERTYPE
    ex_point_customer_type_id: '{{#? EXPOINTCUSTOMERTYPEID}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    //PT_EXCHANGEPOINT_PRODUCT
    ex_point_product_id: '{{#? EXPOINTPRODUCTID}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    // PT_EXCHANGEPOINT_PRODUCTCATEGORY
    ex_point_product_category_id: '{{#? EXPOINTPRODUCTCATEGORYID}}',
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    category_name: '{{#? CATEGORYNAME}}',

    business_id: '{{#? BUSINESSID}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

const defaultFields = [
    'ex_point_id',
    'ex_point_name',
    'created_user',
    'company_name',
    'customer_type_name',
    'created_date',
    'is_system',
    'is_active',
    'is_all_member_type',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'value',
        'point',
        'is_all_member_type',
        'company_id',
        'applied_date_from',
        'applied_date_to',
        'is_apply_all_category',
        'max_ex_point',
        'applied_after',
        'is_apply_website',
        'is_exchange_point_to_money',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listStore = (data = []) => {
    return transform.transform(data, ['ex_point_store_id', 'store_id', 'store_name', 'address', 'company_id']);
};

const listCustomerType = (data = []) => {
    return transform.transform(data, [
        'ex_point_customer_type_id',
        'customer_type_id',
        'customer_type_name',
        'type_name',
        'company_id',
        'business_id',
        'company_name',
        'business_name',
        'created_date',
    ]);
};

const listProductCategory = (data = []) => {
    return transform.transform(data, [
        'ex_point_product_category_id',
        'product_category_id',
        'category_name',
        'company_id',
        'business_id',
        'company_name',
    ]);
};

const listProduct = (data = []) => {
    return transform.transform(data, [
        'ex_point_product_id',
        'product_id',
        'product_code',
        'product_name',
        'company_id',
        'business_id',
        'picture_url'
    ]);
};

module.exports = {
    detail,
    list,
    listStore,
    listCustomerType,
    listProductCategory,
    listProduct,
};
