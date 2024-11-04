const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    //list
    purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
    purchase_requisition_code: '{{#? PURCHASEREQUISITIONCODE}}',
    requisition_user: '{{#? REQUISITIONUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    pr_status_id: '{{#? PRSTATUSID}}',
    purchase_requisition_type_id: '{{#? PURCHASEREQUISITIONTYPEID}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    business_request_name: '{{#? BUSINESSREQUESTNAME}}',
    store_request_name: '{{#? STOREREQUESTNAME}}',
    department_request_name: '{{#? DEPARTMENTREQUESTNAME}}',
    user_review_list: '{{#? USERREVIEWLIST? USERREVIEWLIST.split("|") : []}}',
    //detail
    purchase_requisition_date: '{{#? PURCHASEREQUISITIONDATE}}',
    department_request_id: '{{#? DEPARTMENTREQUESTID}}',
    business_request_id: '{{#? BUSINESSREQUESTID}}',
    store_request_id: '{{#? STOREREQUESTID}}',
    description: '{{#? DESCRIPTION}}',
    document_url: '{{#? DOCUMENTURL}}',
    document_name: '{{#? DOCUMENTNAME}}',
    to_buy_date: '{{#? TOBUYDATE}}',
    //productList
    purchase_requisition_detail_id: '{{#? PURCHASEREQUISITIONDETAILID}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    category_name: '{{#? CATEGORYNAME}}',
    unit_name: '{{#? UNITNAME}}',
    quantity: '{{#? QUANTITY}}',
    // Total PRSTATUSID
    total: '{{#? TOTAL}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'purchase_requisition_id',
        'purchase_requisition_code',
        'business_request_name',
        'store_request_name',
        'department_request_name',
        'requisition_user',
        'created_date',
        'pr_status_id',
        'user_review_list',
        'is_active',
        'business_request_id',
    ]);
};

const detail = (data) => {
    return transform.transform(data, [
        'purchase_requisition_id',
        'purchase_requisition_code',
        'purchase_requisition_date',
        'requisition_user',
        'department_request_id',
        'department_request_name',
        'business_request_id',
        'business_request_name',
        'store_request_id',
        'store_request_name',
        'description',
        'is_active',
        'pr_status_id',
        'purchase_requisition_type_id',
        'document_url',
        'document_name',
        'to_buy_date',
    ]);
};

const productList = (list) => {
    return transform.transform(list, [
        'purchase_requisition_detail_id',
        'product_id',
        'product_code',
        'product_name',
        'category_name',
        'unit_name',
        'quantity',
        'is_active',
    ]);
};

const reviewLevelList = (data = []) => {
    const _template = {
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        review_level_name: '{{#? PURCHASEREQUISITIONREVIEWLEVELNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        business_name: '{{#? BUSINESSNAME}}',
        description: '{{#? DESCRIPTION}}',
        created_user: '{{#? CREATEDUSER}}',
        created_date: '{{#? CREATEDDATE}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const departmentList = (data = []) => {
    const _template = {
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        department_id: '{{#? DEPARTMENTID}}',
        department_name: '{{#? DEPARTMENTNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const positionList = (data = []) => {
    const _template = {
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        department_id: '{{#? DEPARTMENTID}}',
        position_id: '{{#? POSITIONID}}',
        position_name: '{{#? POSITIONNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const levelUserDetailList = (data = []) => {
    const _template = {
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        review_level_name: '{{#? PURCHASEREQUISITIONREVIEWLEVELNAME}}',
        user_review: '{{#? USERREVIEW}}',
        is_review: '{{#? ISREVIEW ? 1: 0}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete: '{{ISCOMPLETE ? 1 : 0}}',
        full_name: '{{#? FULLNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getReviewInformation = (data = {}) => {
    const _template = {
        review_list_id: '{{#? PURCHASEREQUISITIONREVIEWLISTID}}',
        purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
        review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        is_review: '{{ISREVIEW ? 1 : 0}}',
        review_note: '{{#? REVIEWNOTE}}',
        review_date: '{{#? REVIEWDATE}}',
        review_user: '{{#? REVIEWUSER}}',
        full_name: '{{#? FULLNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const reviewList = (data = []) => {
    const _template = {
        // review_level_id: '{{#? PURCHASEREQUISITIONREVIEWLEVELID}}',
        // review_level_name: '{{#? PURCHASEREQUISITIONREVIEWLEVELNAME}}',
        purchase_requisition_id: '{{#? PURCHASEREQUISITIONID}}',
        full_name: '{{#? FULLNAME}}',
        review_date: '{{#? REVIEWDATE}}',
        user_review: '{{#? USERREVIEW}}',
        is_review: '{{ISREVIEW === null ? 2 : ISREVIEW}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const option = (data) => {
    const _template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const prodStocksListCount = (data) => {
    const _template = {
        product_id: '{{#? PRODUCTID}}',
        stocks_count: '{{#? STOCKSCOUNT}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const countPrStatus = (list = []) => {
    return transform.transform(list, ['pr_status_id', 'total']);
};

module.exports = {
    list,
    detail,
    productList,
    reviewLevelList,
    departmentList,
    positionList,
    levelUserDetailList,
    option,
    getReviewInformation,
    reviewList,
    countPrStatus,
    prodStocksListCount,
};
