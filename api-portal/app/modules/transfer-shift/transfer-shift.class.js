const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    transfer_shift_id: '{{#? TRANSFERSHIFTID}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
    transfer_shift_type_id: '{{#? TRANSFERSHIFTTYPEID}}',
    transfer_shift_type_name: '{{#? TRANSFERSHIFTTYPENAME}}',
    date_to: '{{#? DATETO}}',
    date_from: '{{#? DATEFROM}}',
    current_shift_id: '{{#? CURRENTSHIFTID}}',
    current_shift_name: '{{#? CURRENTSHIFTNAME}}',
    new_shift_id: '{{#? NEWSHIFTID}}',
    new_shift_name: '{{#? NEWSHIFTNAME}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    current_business_id: '{{#? CURRENTBUSINESSID}}',
    current_business_name: '{{#? CURRENTBUSINESSNAME}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    current_store_id: '{{#? CURRENTSTOREID}}',
    current_store_name: '{{#? CURRENTSTORENAME}}',
    reason: '{{#? REASON}}',
    transfer_status: '{{#? TRANSFERSTATUS}}',
    create_date: '{{#? CREATEDDATE}}',
    is_show_review: '{{ISSHOWREVIEW === 0 ? 0 : ISSHOWREVIEW }}',
    // Thông tin mức duyệt
    transfer_shift_review_list_id: '{{#? TRANSFERSHIFTREVIEWLISTID}}',
    review_level_name: '{{#? REVIEWLEVELNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    is_auto_review: '{{#? ISAUTOREVIEW}}',
    is_complete_review: '{{#? ISCOMPLETEREVIEW}}',
    avatar_image: [
        {
            '{{#if AVATARIMAGE}}': `${config.domain_cdn}{{AVATARIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_review: '{{ISREVIEW === 0 ? 0 : ISREVIEW === 1? 1: ISREVIEW}}', // 1. đã duyệt , null. chưa duyệt, 0. không duyệt, 2. đang duyệt
    review_level_id: '{{#? REVIEWLEVELID}}',
    review_user_name: '{{#? REVIEWUSERNAME}}',
    review_user: '{{#? REVIEWUSER}}',
    // Shift
    shift_id: '{{#? SHIFTID}}',
    shift_name: '{{#? SHIFTNAME}}',

    is_another_business: '{{#? ISANOTHERBUSINESS}}',
};

const defaultFields = [
    'transfer_shift_id',
    'full_name',
    'transfer_shift_type_name',
    'transfer_shift_type_id',
    'date_to',
    'date_from',
    'current_shift_name',
    'new_shift_name',
    'create_date',
    'is_review',
    'store_name',
    'is_show_review',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'user_name',
        'current_shift_id',
        'new_shift_id',
        'transfer_shift_type_id',
        'store_id',
        'current_store_id',
        'current_business_id',
        'business_id',
        'reason',
        'business_name',
        'current_business_name',
        'current_store_name',
        'is_auto_review',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const detailReview = (data) => {
    return transform.transform(data, [
        'review_level_name',
        'review_user_name',
        'avatar_image',
        'is_review',
        'transfer_shift_review_list_id',
    ]);
};

const listReview = (data = []) => {
    return transform.transform(data, [
        'transfer_shift_review_list_id',
        'review_level_name',
        'full_name',
        'is_auto_review',
        'review_level_id',
        'is_complete_review',
        'review_user',
        'transfer_shift_id',
        'avatar_image',
        'is_review',
        'user_name',
    ]);
};

const listUser = (data = []) => transform.transform(data, ['user_name', 'full_name', 'review_level_id']);

const listTransferShiftType = (data = []) =>
    transform.transform(data, [
        'transfer_shift_type_id',
        'transfer_shift_type_name',
        'is_another_business',
        'is_auto_review',
    ]);

const listStore = (data = []) => transform.transform(data, ['store_id', 'store_name']);

const listShift = (data = []) => {
    return transform.transform(data, ['shift_id', 'shift_name']);
};

const option = (data = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    detail,
    list,
    listReview,
    detailReview,
    listShift,
    listStore,
    listTransferShiftType,
    listUser,
    option,
};
