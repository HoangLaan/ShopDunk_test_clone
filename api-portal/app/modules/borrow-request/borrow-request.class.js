const Transform = require('../../common/helpers/transform.helper');

const templateReview = {
    borrow_review_level_id: '{{#? BORROWREVIEWLEVELID}}',
    borrow_review_level_name: '{{#? BORROWREVIEWLEVELNAME}}',
    company_id: '{{#? COMPANYID}}',
    users: '{{#? USERS}}',
    review_users_name: '{{#? REVIEWUSERNAME}}',
    borrow_request_id: '{{#? BORROWREQUESTID}}',
    borrow_request_code: '{{#? BORROWREQUESTCODE}}',
    borrow_date: '{{#? BORROWDATE}}',
    borrow_date_return: '{{#? BORROWDATERETURN}}',
    stock_borrow_id: '{{#? BORROWSTOCKSID}}',
    stock_out_id: '{{#? EXPORTSTOCKSID}}',
    borrow_user: '{{#? BORROWUSER}}',
    borrow_user_name: '{{#? BORROWUSERNAME}}',
    employee_borrow: '{{#? BORROWUSER}}',
    borrow_date_receive: '{{#? BORROWDATERECEIVE}}',
    note: '{{#? NOTE}}',
    created_date: '{{#? CREATEDATE}}',
    borrow_stocks_name: '{{#? BORROWSTOCKSNAME}}',
    export_stocks_name: '{{#? EXPORTSTOCKSNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    manufacture_name: '{{#? MANUFACTURERNAME}}',
    quantity: '{{#? QUANTITY}}',
    user_review: '{{#? REVIEWUSER}}',
    note: '{{#? NOTE}}',
    user_id: '{{#? USERNAME}}',
    store_borrow_id: '{{#? BORROWSTOREID}}',
    store_out_id: '{{#? EXPORTSTOREID}}',
    borrow_type_id: '{{#? BORROWTYPEID}}',
    date_borrow: '{{#? BORROWDATE}}',
    date_return: '{{#? BORROWDATERETURN}}',
    // avatar_url: '{{#? BORROWDATERETURN}}',
    is_can_review: '{{#? ISCANREVIEW ? ISCANREVIEW : 0}}',
    is_review: '{{#? ISREVIEW ? ISREVIEW : 0}}',
};

const defaultFields = [
    'borrow_request_id',
    'borrow_request_code',
    'borrow_date',
    'borrow_date_return',
    'borrow_stock_id',
    'borrow_user',
    'borrow_date_receive',
    'note',
    'created_date',
];

let transform = new Transform(templateReview);

const listReview = (list = []) => {
    return transform.transform(list, ['borrow_review_level_id', 'borrow_review_level_name', 'company_id', 'users', 'borrow_request_id', 'review_users_name']);
};

const list = (data = []) => {
    return transform.transform(data, [...defaultFields, 'borrow_user_name', 'borrow_stocks_name', 'export_stocks_name', 'is_can_review', 'is_review']);
};

const detailUser = (user = {}) => {
    return new Transform({
        user_id: '{{#? USERID}}',
        username: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
    }).transform(user, ['user_id', 'username', 'full_name']);
};

const detail = (data = {}) => {
    return transform.transform(data, [...defaultFields,'date_return', 'date_borrow','borrow_type_id', 'company_id', 'employee_borrow', 'stock_borrow_id', 'stock_out_id', 'store_borrow_id', 'store_out_id']);
};

const detailProduct = (data = []) => {
    return transform.transform(data, ['product_code', 'product_id', 'product_name', 'manufacture_name', 'quantity', 'reason']);
};

const detailReview = (data = []) => {
    return transform.transform(data, ['borrow_review_level_id', 'borrow_review_level_name', 'company_id', 'borrow_request_id', 'user_review', 'is_review']);
};

const detailUserReview = (data = []) => {
    return transform.transform(data, ['user_id', 'username', 'full_name']);
};

module.exports = {
    listReview,
    detailUser,
    list,
    detail,
    detailProduct,
    detailReview,
    detailUserReview,
};
