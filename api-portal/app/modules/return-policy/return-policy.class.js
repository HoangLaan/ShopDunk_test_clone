const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    // Return Policy
    return_policy_id: '{{#? RETURNPOLICYID}}',
    return_policy_code: '{{#? RETURNPOLICYCODE}}',
    return_policy_name: '{{#? RETURNPOLICYNAME}}',
    description: '{{#? DESCRIPTION}}',
    is_return: '{{ISRETURN ? 1 : 0}}',
    is_exchange: '{{ISEXCHANGE ? 1 : 0}}',
    is_cashback: '{{ISCASHBACK ? 1 : 0}}',
    is_depreciation: '{{ISDEPRECIATION ? 1 : 0}}',
    percent_value: '{{#? PERCENTVALUE}}',
    is_apply_all_category: '{{ISAPPLYALLCATEGORY ? 1 : 0}}',
    is_apply_all_customer_type: '{{ISAPPLYALLCUSTOMERTYPE ? 1 : 0}}',
    is_apply_discount_order: '{{ISAPPLYDISCOUNTORDER ? 1 : 0}}',
    is_apply_discount_product: '{{ISAPPLYDISCOUNTPRODUCT ? 1 : 0}}',
    is_exchange_lower_price_product: '{{ISEXCHANGELOWERPRICEPRODUCT ? 1 : 0}}',
    is_other_condition: '{{ISOTHERCONDITION ? 1 : 0}}',
    number_return_day: '{{#? NUMBERRETURNDAY}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',

    // table map
    return_policy_condition_id: '{{#? RETURNPOLICYCONDITIONID}}',
    return_policy_customer_type_id: '{{#? RETURNPOLICYCUSTOMERTYPEID}}',
    return_policy_category_id: '{{#? RETURNPOLICYCATEID}}',
    return_policy_product_id: '{{#? RETURNPOLICYPRODUCTID}}',

    // Return Condition
    return_condition_id: '{{#? RETURNCONDITIONID}}',
    return_condition_name: '{{#? RETURNCONDITIONNAME}}',

    // Product Category
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    category_name: '{{#? CATEGORYNAME}}',
    parent_name: '{{#? PARENTNAME}}',
    parent_id: '{{#? PARENTID}}',
    category_list: '{{#? CATEGORYLIST}}',

    // Product
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',

    // CustomerType
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
};

const transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'return_policy_id',
        'return_policy_code',
        'return_policy_name',
        'description',
        'is_return',
        'is_exchange',
        'is_cashback',
        'is_depreciation',
        'percent_value',
        'is_apply_all_category',
        'is_apply_all_customer_type',
        'is_apply_discount_order',
        'is_apply_discount_product',
        'is_exchange_lower_price_product',
        'is_other_condition',
        'number_return_day',
        'start_date',
        'end_date',
        'is_active',
        'is_system',

        // table map
        'return_condition_id',
        'return_policy_condition_id',
        'customer_type_id',
        'return_policy_customer_type_id',
        'product_category_id',
        'return_policy_category_id',
        'product_id',
        'return_policy_product_id',

        // Condition
        'return_condition_name',

        // Product Category
        'parent_name',
        'category_name',

        // Product
        'product_name',
        'product_code',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'return_policy_id',
        'return_policy_code',
        'return_policy_name',
        'start_date',
        'end_date',
        'percent_value',
        'is_apply_all_category',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
        'category_list',
    ]);
};

const listCategory = (list = []) => {
    return transform.transform(list, ['category_name']);
};

const listCondition = (list = []) => {
    return transform.transform(list, [
        'return_condition_id',
        'return_condition_name',
        'created_date',
        'created_user',
        'is_active',
    ]);
};

const listProductCategory = (data = []) => {
    return transform.transform(data, ['product_category_id', 'category_name', 'parent_name', 'parent_id', 'is_active']);
};

const listProduct = (data = []) => {
    return transform.transform(data, [
        'product_id',
        'product_code',
        'product_name',
        'product_category_id',
        'category_name',
        'is_active',
    ]);
};

const productOptions = (data = []) => {
    return transform.transform(data, ['product_id', 'product_name']);
};

module.exports = {
    detail,
    list,
    listCondition,
    listProductCategory,
    listProduct,
    listCategory,
    productOptions,
};
