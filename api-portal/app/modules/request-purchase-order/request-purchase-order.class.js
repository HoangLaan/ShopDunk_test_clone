const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        request_purchase_id: '{{#? REQUESTPURCHASEID}}',
        request_purchase_code: '{{#? REQUESTPURCHASECODE}}',
        request_purchase_date: '{{#? REQUESTPURCHASEDATE}}',
        created_date: '{{#? CREATEDDATE}}',
        is_active: '{{ ISACTIVE ? 1: 0}}',
        is_reviewed: '{{ISREVIEWED ? ISREVIEWED : (ISREVIEWED === null ? 2 : 0) }}',
        is_ordered: '{{#? ISORDERED}}',
        is_ordered_num: '{{#? ISORDEREDNUM? 1: 0}}',
        is_reviewed_num: '{{#? ISREVIEWEDNUM? 1: 0}}',
        is_ordered_origin: '{{#? ISORDEREDORIGIN}}',
        business_name: '{{#? BUSINESSNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        user_full_name: '{{#? USERFULLNAME}}',
        full_name: '{{#? FULLNAME}}',
        user_review_list: '{{#? USERREVIEWLIST}}',
        is_reviewed_all: '{{#? ISREVIEWEDALL}}',
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
        discount_program_id: '{{#? DISCOUNTPROGRAMID}}',
        status: '{{#? STATUS}}',
        supplier_id: '{{#? SUPPLIERID}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        supplier_address: '{{#? SUPPLIERADDRESS}}',
        supplier_phone: '{{#? SUPPLIERPHONE}}',
        manufacturer_id: '{{#? MANUFACTURERID}}',
        manufacturer_name: '{{#? MANUFACTURERNAME}}',
        description: '{{#? DESCRIPTION}}',
        manufacturer_address: '{{#? MANUFACTURERADDRESS}}',
        review_user: '{{#? REVIEWUSER}}',
        company_id: '{{ COMPANYID ? String(COMPANYID) : null}}',
        company_name : '{{#? COMPANYNAME}}',
        business_request_id: '{{#? BUSINESSREQUESTID}}',
        department_request_id: '{{#? DEPARTMENTREQUESTID}}',
        business_receive_id: '{{#? BUSINESSRECEIVEID}}',
        store_receive_id: '{{#? STORERECEIVEID}}',
        store_receive_name: '{{#? STORERECEIVENAME}}',
        area_id: '{{#? AREAID}}',
        username: '{{#? USERNAME}}',
        is_active: '{{ ISACTIVE ? 1: 0}}',
        is_ordered: '{{ ISORDERED ? 1: 0}}',
        purchase_data: '{{#? PURCHASEDATA}}',
        is_purchase_samsung: '{{ISPURCHASESAMSUNG ? 1 : 0}}',
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
        vat_value: '{{VATVALUE ? VATVALUE : 0}}',
        vat_price: '{{VATPRICE ? VATPRICE : 0}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        unit_id: '{{#? UNITID}}',
        total_price: '{{#? TOTALPRICE}}',
        po_price: '{{#? TOTALPRICE}}',
        unit_name: '{{#? UNITNAME}}',
        quantity_expected: '{{#? QUANTITYEXPECTED}}',
        total_quantity: '{{#? TOTALQUANTITY}}',
        quantity: '{{#? TOTALQUANTITY}}',
        quantity_reality: '{{ QUANTITYREALITY ? QUANTITYREALITY : 0}}',
        count_purchase_requisition: '{{#? COUNTPURCHASEREQUISITION}}',
        cost_price: '{{#? COSTPRICE}}',
        rpo_price: '{{#? COSTPRICE}}',
        price_nearly: '{{#? PRICENEARLY}}',
        is_reviewed: '{{ ISREVIEWED ? 1: ISREVIEWED}}',
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

const getOrderHistory = (data = []) => {
    const _template = {
        order_id: '{{#? ORDERID}}',
        product_id: '{{#? PRODUCTID}}',
        quantity: '{{#? QUANTITY}}',
        price: '{{#? PRICE}}',
        total_price: '{{#? TOTALPRICE}}',
        product_name: '{{#? PRODUCTNAME}}',
        imei_code: '{{#? IMEICODE}}',
        store_id: '{{#? STOREID}}',
        store_code: '{{#? STORECODE}}',
        store_name: '{{#? STORENAME}}',
        order_date: '{{#? ORDERDATE}}',
        order_no: '{{#? ORDERNO}}',
        business_name: '{{#? BUSINESSNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const countIsOrdered = (data = []) => {
    const _template = {
        is_ordered: '{{ISORDERED ? 1 : 0}}',
        total: '{{#? TOTAL}}',
    };
    return new Transform(_template).transform(data, ['is_ordered', 'total']);
};

const getUserByDepartmentId = (data = []) => {
    const _template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
    };
    return new Transform(_template).transform(data, ['user_name', 'full_name']);
};

const detailReviewLevel = (data = []) => {
    const _template = {
        user_name: '{{#? USERNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        is_auto_review: '{{ ISAUTOREVIEW? 1: 0}}',
        is_complete: '{{ ISCOMPLETE ? 1 : 0}}',
        is_reviewed: '{{ ISREVIEWED ? ISREVIEWED : 0}}',
    };
    return new Transform(_template).transform(data, [
        'user_name',
        'department_id',
        'is_auto_review',
        'is_complete',
        'is_reviewed',
    ]);
};

const options = (list = []) => {
    const template = {
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    };
    return new Transform(template).transform(list, Object.keys(template));
};

module.exports = {
    list,
    detail,
    detailPR,
    detailPRProduct,
    searchPurchaseRequisition,
    getOrderHistory,
    countIsOrdered,
    getUserByDepartmentId,
    detailReviewLevel,
    options,
};
