const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_transfer_type_id: '{{#? STOCKSTRANSFERTYPEID}}',
    stocks_transfer_type_name: '{{#? STOCKSTRANSFERTYPENAME}}',
    transfer_type: '{{#? TRANSFERTYPE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATEVIEW}}',
    is_deleted: '{{#? ISDELETED}}',
    description: '{{#? DESCRIPTION}}',
    is_system: '{{ISSYSTEM ? 1 : 0 }}',
    is_stocks_in_review: '{{#? ISSTOCKSTRANSFERREVIEW}}', //0: tu dong duyet, 1: ap dung muc duyet
    stocks_transtype_review_level_id: '{{#? STOCKSTRANSTYPEREVIEWLEVELID}}',
    stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
    review_order_index: '{{#? REVIEWORDERINDEX}}',
    is_auto_reviewed: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_completed_reviewed: '{{ISCOMPLETEDREVIEWED ? 1 : 0}}',
    stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
    stocks_transtype_review_user_id: '{{#? STOCKSTRANSTYPEREVIEWUSERID}}',
    department_id: '{{#? DEPARTMENTID}}',
    name: '{{#? NAME}}',
    id: '{{#? ID}}',
    label: '{{#? NAME}}',
    value: '{{#? ID}}',
    user_name: '{{#? ID}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'stocks_transfer_type_id',
        'stocks_transfer_type_name',
        'is_active',
        'created_date',
        'created_user',
        'description',
        // 'is_system',
    ]);
};

const detail = (data = {}) => {
    return data && Object.keys(data).length > 0
        ? transform.transform(data, [
              'stocks_transfer_type_id',
              'stocks_transfer_type_name',
              'transfer_type',
              'is_active',
              'is_system',
              'description',
              'is_stocks_in_review',
          ])
        : null;
};

const listStocksTransReview = (data = []) => {
    return transform.transform(data, [
        // 'stocks_transtype_review_level_id',
        'stocks_transfer_type_id',
        'stocks_review_level_id',
        // 'review_order_index',
        'is_auto_reviewed',
        'is_completed_reviewed',
        // 'stocks_review_level_name',
    ]);
};

const listStocksTransReviewUser = (data = []) => {
    return transform.transform(data, [
        // 'stocks_transtype_review_user_id',
        'stocks_transfer_type_id',
        'stocks_review_level_id',
        'department_id',
        'user_name',
        'id',
        'label',
        'value',
    ]);
};

const listReviewUser = (data = []) => {
    return transform.transform(data, [
        'id',
        'name',
        'department_id',
        'stocks_review_level_id',
        'user_name',
        'label',
        'value',
    ]);
};

const getOptions = (data = []) => {
    const transform = new Transform({
        name: '{{#? NAME}}',
        id: '{{#? ID}}',
        transfer_type: '{{TRANSFERTYPE ? TRANSFERTYPE : 0}}',
    });

    return transform.transform(data, ['id', 'name', 'transfer_type']);
};

module.exports = {
    list,
    detail,
    listStocksTransReview,
    listStocksTransReviewUser,
    listReviewUser,
    getOptions,
};
