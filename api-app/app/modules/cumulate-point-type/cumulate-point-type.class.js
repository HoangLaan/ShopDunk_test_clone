const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    ac_point_id: '{{#? ACPOINTID}}',
    ac_point_name: '{{#? ACPOINTNAME}}',
    value: '{{#? VALUE}}',
    point: '{{#? POINT}}',
    description: '{{#? DESCRIPTION}}',
    is_all_member_type: '{{ISALLMEMBERTYPE ? 1 : 0}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    point_aff_member: '{{#? POINTAFFMEMBER}}',
    point_referred: '{{#? POINTREFERRED}}',
    is_apply_condition: '{{ISAPPLYCONDITION ? 1 :0}}',
    is_apply_all_category: '{{ISAPPLYALLCATEGORY ? 1 : 0  }}',
    effective_date_from: '{{#? EFFECTIVEDATEFROM}}',
    effective_date_to: '{{#? EFFECTIVEDATETO}}',
    //PT_ACCUMULATEPOINT_STORE
    ac_point_store_id: '{{#? ACPOINTSTOREID}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    address: '{{#? ADDRESS}}',
    //PT_ACCUMULATEPOINT_CUSTOMERTYPE
    ac_point_customer_type_id: '{{#? ACPOINTCUSTOMERTYPEID}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    //PT_ACCUMULATEPOINT_PRODUCT
    ac_point_product_id: '{{#? ACPOINTPRODUCTID}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    // PT_ACCUMULATEPOINT_PRODUCTCATEGORY
    ac_point_product_category_id: '{{#? ACPOINTPRODUCTCATEGORYID}}',
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    category_name: '{{#? CATEGORYNAME}}',
    // PT_ACCUMULATETYPE_CONDITION
    ac_point_condition_id: '{{#? ACPOINTCONDITIONID}}',
    order_value_from: '{{#? ORDERVALUEFROM}}',
    order_value_to: '{{#? ORDERVALUETO}}',

    business_id: '{{#? BUSINESSID}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
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
    'ac_point_id',
    'ac_point_name',
    'created_user',
    'company_name',
    'customer_type_name',
    'create_date',
    'is_system',
    'is_active',
    'is_all_member_type',
];

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        ...defaultFields,
        'value',
        'point',
        'is_all_member_type',
        'company_id',
        'point_aff_member',
        'point_referred',
        'is_apply_condition',
        'effective_date_from',
        'effective_date_to',
        'is_apply_all_category',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listStore = (data = []) => {
    return transform.transform(data, ['ac_point_store_id', 'store_id', 'store_name', 'address', 'company_id']);
};

const listCondition = (data = []) => {
    return transform.transform(data, [
        'ac_point_condition_id',
        'order_value_from',
        'order_value_to',
        'point_aff_member',
        'point_referred',
    ]);
};

const listCustomerType = (data = []) => {
    return transform.transform(data, [
        'ac_point_customer_type_id',
        'customer_type_id',
        'customer_type_name',
        'type_name',
        'company_id',
        'business_id',
        'company_name',
        'business_name',
    ]);
};

const listProductCategory = (data = []) => {
    return transform.transform(data, [
        'ac_point_product_category_id',
        'product_category_id',
        'category_name',
        'company_id',
        'business_id',
        'company_name',
    ]);
};

const listProduct = (data = []) => {
    return transform.transform(data, [
        'ac_point_product_id',
        'product_id',
        'product_code',
        'product_name',
        'company_id',
        'business_id',
        'picture_url',
    ]);
};

const listOptions = (data = []) => {
    const template = {
        value: '{{#? ACPOINTID}}',
        label: '{{#? ACPOINTNAME}}',
    };

    let transform = new Transform(template);

    return transform.transform(data, ['value', 'label']);
};

module.exports = {
    detail,
    list,
    listStore,
    listCondition,
    listCustomerType,
    listProductCategory,
    listProduct,
    listOptions,
};
