const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    stocks_take_type_id: '{{#? STOCKTAKETYPEID}}',
    stocks_take_type_name: '{{#? STOCKSTAKETYPENAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{#? ISACTIVE}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',

    stocks_take_type: '{{#? STOCKSTAKETYPE}}',
    is_stocks_take_review: '{{ISSTOCKSTAKEREVIEW ? 1 : 0}}',
    stocks_take_review_level_list: '{{#? STOCKSTAKETYPEREVIEWLEVELID}}',
    review_order_index: '{{REVIEWORDERINDEX  ? 1 : 0}}',
    is_auto_reviewed: '{{ISAUTOREVIEWED  ? 1 : 0}}',
    is_completed_reviewed: '{{ISCOMPLETEDREVIEWED  ? 1 : 0}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    user_name: '{{#? USERNAME}}',
    user_name_selected: '{{#? USERNAMESELECTED}}',
    users: '{{#? USERS}}',
    stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
    stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
    description: '{{#? DESCRIPTION}}',
    fullname: '{{#? FULLNAME}}',

    is_stocks_take_imei_code: '{{ISSTOCKSTAKEIMEICODE  ? 1 : 0}}',

    stocks_in_review_level_id: '{{#? STOCKSTAKETYPEREVIEWLEVELID}}',
    name: '{{#? NAME}}',
    id: '{{#? ID}}',
    label: '{{#? NAME}}',
    value: '{{#? ID}}',
};

let transform = new Transform(template);

const list = (users = []) => {
    return transform.transform(users, [
        'stocks_take_type_id',
        'stocks_take_type_name',
        'is_active',
        'created_date',
        'created_user',
        'is_deleted',
        'is_stocks_take_review',
        'is_stocks_take_imei_code',
    ]);
};

const optionsStocksTakeType = (data) => {
    return transform.transform(data, ['stocks_take_type_id', 'stocks_take_type_name', 'is_stocks_take_imei_code']);
};

const detail = (user) => {
    return transform.transform(user, [
        'stocks_take_type_id',
        'stocks_take_type_name',
        'is_active',
        'created_date',
        'created_user',
        'is_active',
        'description',
        'is_stocks_take_review',
        ,
        'is_stocks_take_imei_code',
    ]);
};

const listReviewLevel = (data = []) => {
    return transform.transform(data, [
        'stocks_take_review_level_id',
        'stocks_review_level_id',
        'stocks_review_level_name',
        'is_auto_reviewed',
        'is_completed_reviewed',
        'department_id',
        'department_name',
        'user_name',
        'users',
        'name',
        'id',
        'value',
        'label',
    ]);
};

const listReviewUser = (data = []) => {
    return transform.transform(data, [
        'stocks_in_review_level_id',
        'stocks_review_level_id',
        'department_id',
        'department_name',
        'user_name',
        'users',
        'name',
        'id',
        'value',
        'label',
        'user_name_selected',
        'fullname',
        'users',
    ]);
};

const reviewList = (list) => {
    const transform = new Transform({
        stocks_take_type_id: '{{#? STOCKSTAKETYPEID}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
    });
    return transform.transform(list, [
        'stocks_take_type_id',
        'stocks_review_level_id',
        'user_name',
        'full_name',
        'department_id',
    ]);
};

const users = (data) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        department_id: '{{#? DEPARTMENTID}}',
    });
    return transform.transform(data, ['id', 'name', 'department_id', 'value', 'label']);
};

const options = (data) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        department_id: '{{#? DEPARTMENTID}}',
    });
    return transform.transform(data, ['id', 'name', 'department_id']);
};

const listRlUser = (dataList = [], useDetail = true) => {
    const template = {
        stocks_review_level_id: '{{#? REVIEWLEVELID}}',
        department_id: '{{#? DEPARTMENTID}}',
        value: '{{#? USERREVIEW}}',
        id: '{{#? USERREVIEW}}',
        order_index: '{{#? ORDERINDEX}}',
        expend_type_id: '{{#? RPID}}',
        name: '{{#? FULLNAME}}',
        label: '{{#? FULLNAME}}',
        is_completed_reviewed: '{{ISCOMPLETEREVIEW ? 1 : 0}}',
        is_auto_reviewed: '{{ISAUTOREVIEW ? 1 : 0}}',

        review_level_name: '{{#? REVIEWLEVELNAME}}',
        username: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        user_id: '{{#? USERID}}',
        default_picture_url: `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        department_id: '{{#? DEPARTMENTID}}',
        company_id: '{{#? COMPANYID}}',
    };
    let transform = new Transform(template);
    if (!useDetail)
        return transform.transform(dataList, [
            'stocks_review_level_id',
            'review_level_name',
            'username',
            'full_name',
            'user_id',
            'default_picture_url',
            'is_auto_reviewed',
            'is_completed_reviewed',
        ]);
    return transform.transform(dataList, [
        'stocks_review_level_id',
        'value',
        'id',
        'order_index',
        'expend_type_id',
        'name',
        'label',
        'is_completed_reviewed',
        'is_auto_reviewed',
    ]);
};

const listStocksTypeReviewLevel = (data) => {
    const object = {
        stocks_take_type_review_level_id: '{{#? STOCKSTAKETYPEREVIEWLEVELID}}',
        stocks_take_type_id: '{{#? STOCKSTAKETYPEID}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        is_auto_reviewed: '{{ISAUTOREVIEWED ? 1 : 0}}',
        is_complete_reviewed: '{{ISCOMPLETEDREVIEWED ? 1 : 0}}',
        stocks_review_leve_name: '{{#? STOCKSREVIEWLEVELNAME}}',
    };
    const transform = new Transform(object);
    return transform.transform(data, Object.keys(object));
};

const listUserReiew = (data) => {
    const object = {
        department_id: '{{#? DEPARTMENTID}}',
        full_name: '{{#? FULLNAME}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_take_type_id: '{{#? STOCKSTAKETYPEID}}',
        stocks_take_type_review_user_id: '{{#? STOCKSTAKETYPEREVIEWUSERID}}',
        user_name: '{{#? USERNAME}}',
        is_auto_reviewed: '{{ISAUTOREVIEWED ? 1 : 0}}',
        is_complete_reviewed: '{{ISCOMPLETEDREVIEWED ? 1 : 0}}',
    };
    const transform = new Transform(object);
    return transform.transform(data, Object.keys(object));
};

module.exports = {
    detail,
    list,
    reviewList,
    listReviewLevel,
    options,
    optionsStocksTakeType,
    users,
    listRlUser,
    listReviewUser,
    listStocksTypeReviewLevel,
    listUserReiew,
};
