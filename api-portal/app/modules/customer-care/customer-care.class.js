const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        customer_id: '{{#? CUSTOMERID}}',
        object_type: '{{#? OBJECTTYPE }}',
        is_customer_leads: '{{ OBJECTTYPE === 3 ? 1: 0}}',
        member_id: '{{#? OBJECTTYPE === 1? null: CUSTOMERID}}',
        partner_id: '{{#? OBJECTTYPE === 2? CUSTOMERID: null}}',
        data_leads_id: '{{#? OBJECTTYPE === 3? CUSTOMERID: null}}',
        full_name: '{{#? FULLNAME}}',
        gender: '{{#? GENDER}}',
        gender_text: '{{ GENDER? "Nam": "Nữ" }}',
        birthday: '{{#? BIRTHDAY}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        address: '{{#? ADDRESS}}',
        address_full: '{{#? ADDRESSFULL}}',
        source_id: '{{#? SOURCEID}}',
        source_name: '{{#? SOURCENAME}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
        customer_type_name: '{{#? CUSTOMERTYPENAME}}',
        zalo_id: '{{#? ZALOID}}',
        order_count: '{{#? ORDERCOUNT}}',
        days_since_last_order: '{{#? DAYSSINCELASTORDER}}',
        last_order_date: '{{#? LASTORDERDATE}}',
        product_order_count: '{{#? PRODUCTORDERCOUNT}}',
        count_task: '{{#? COUNTTASK}}',
        no_care_days: '{{#? NOCAREDAYS}}',
        is_in_process: '{{#? ISINPROCESS}}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
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

const detailPR = (data = {}) => {
    const _template = {
        request_purchase_id: '{{#? REQUESTPURCHASEID}}',
        purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
        purchase_requisition_code: '{{#? PURCHASEREQUISITIONCODE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const detailPRProduct = (data = []) => {
    const _template = {
        request_purchase_detail_id: '{{#? REQUESTPURCHASEDETAILID}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        category_name: '{{#? CATEGORYNAME}}',
        manufacturer_name: '{{#? MANUFACTURERNAME}}',
        unit_id: '{{#? UNITID}}',
        total_price: '{{#? TOTALPRICE}}',
        unit_name: '{{#? UNITNAME}}',
        quantity_expected: '{{#? QUANTITYEXPECTED}}',
        total_quantity: '{{#? TOTALQUANTITY}}',
        quantity_reality: '{{ QUANTITYREALITY ? QUANTITYREALITY : 0}}',
        count_purchase_requisition: '{{#? COUNTPURCHASEREQUISITION}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const searchPurchaseRequisition = (data = []) => {
    const _template = {
        purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
        purchase_requisition_date: '{{#? PURCHASEREQUISITIONDATE}}',
        purchase_requisition_code: '{{#? PURCHASEREQUISITIONCODE}}',
        product_id: '{{#? PRODUCTID}}',
        quantity: '{{#? QUANTITY}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        business_request_id: '{{#? BUSINESSREQUESTID}}',
        business_request_name: '{{#? BUSINESSREQUESTNAME}}',
        department_request_id: '{{#? DEPARTMENTREQUESTID}}',
        department_request_name: '{{#? DEPARTMENTREQUESTNAME}}',
        store_request_id: '{{#? STOREREQUESTID}}',
        store_request_name: '{{#? STOREREQUESTNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    detail,
    detailPR,
    detailPRProduct,
    searchPurchaseRequisition
};
