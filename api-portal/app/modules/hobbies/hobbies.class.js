const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        hobbies_id: '{{#? HOBBIESID}}',
        hobbies_name: '{{#? HOBBIESNAME}}',
        is_apply_attribute: '{{ ISAPPLYATTRIBUTE ? 1: 0}}',
        description: '{{#? DESCRIPTION}}',
        product_attribute_name_list: '{{#? PRODUCTATTRIBUTENAMELIST}}',
        hobbies_value_list: '{{#? HOBBIESVALUELIST}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const detail = (data = {}) => {
    const _template = {
        request_purchase_id: '{{#? REQUESTPURCHASEID}}',
        request_purchase_code: '{{#? REQUESTPURCHASECODE}}',
        request_purchase_date: '{{#? REQUESTPURCHASEDATE}}',
        is_reviewed: '{{#? ISREVIEWED}}',
        created_date: '{{#? CREATEDDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        user_id: '{{#? USERID}}',
        user_full_name: '{{#? FULLNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        supplier_id: '{{#? SUPPLIERID}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        supplier_address: '{{#? SUPPLIERADDRESS}}',
        supplier_phone: '{{#? SUPPLIERPHONE}}',
        manufacturer_id: '{{#? MANUFACTURERID}}',
        manufacturer_name: '{{#? MANUFACTURERNAME}}',
        description: '{{#? DESCRIPTION}}',
        manufacturer_address: '{{#? MANUFACTURERADDRESS}}',
        review_user: '{{#? REVIEWUSER}}',
        company_id: '{{#? COMPANYID}}',
        business_request_id: '{{#? BUSINESSREQUESTID}}',
        department_request_id: '{{#? DEPARTMENTREQUESTID}}',
        business_receive_id: '{{#? BUSINESSRECEIVEID}}',
        store_receive_id: '{{#? STORERECEIVEID}}',
        username: '{{#? USERNAME}}',
        is_active: '{{ ISACTIVE ? 1: 0}}',
        is_ordered: '{{ ISORDERED ? 1: 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    detail,
};
