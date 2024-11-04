const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    announce_id: '{{#? ANNOUNCEID}}',
    announce_type_id: '{{#? ANNOUNCETYPEID}}',
    // is_push_to_all: '{{#? ISPUSHTOALL ? 1 : 0}}',
    is_send_to_all: '{{#? PUSHTYPE}}',
    announce_title: '{{#? ANNOUNCETITLE}}',
    announce_content: '{{#? ANNOUNCECONTENT}}',
    published_date: '{{#? PUBLISHEDDATE}}',
    description: '{{#? DESCRIPTION}}',
    is_review: '{{#? ISREVIEW ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    update_user: '{{#? UPDATEUSER}}',
    update_date: '{{#? UPDATEDATE }}',
    is_delete: '{{ISDELETED ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    is_pushed: '{{ISPUSHED ? 1 : 0}}',

    attachment_path: [
        {
            '{{#if ATTACHMENTPATH}}': `${config.domain_cdn.slice(0, -1)}{{ATTACHMENTPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    attachment_name: '{{#? ATTACHMENTNAME}}',
    announce_attachment_id: '{{#? ANNOUNCEATTACHMENTID}}',

    announce_review_id: '{{#? ANNOUNCEREVIEWID}}',

    announce_type_id: '{{#? ANNOUNCETYPEID}}',
    announce_type_name: '{{#? ANNOUNCETYPENAME}}',

    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',

    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',

    avatar: '{{#? AVATAR}}',
    name: '{{#? NAME}}',
    review_status: '{{REVIEWSTATUS ? REVIEWSTATUS : 0}}',
    username: '{{#? USERNAME}}',
    published_date: '{{#? PUBLISHEDDATE}}',
    fullname: '{{#? FULLNAME}}',
    total_view: '{{TOTALVIEW ? TOTALVIEW : 0}}',
    is_read: '{{ISREAD ? ISREAD : 0}}',
    default_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': `${config.domain_cdn}/uploads/d-book.png`,
        },
    ],
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'announce_id',
        'announce_title',
        'announce_content',
        'announce_type_id',
        'announce_type_name',
        'created_user',
        'created_date',
        'published_date',
        'is_review',
    ]);
};
const listAnnounceView = (list = []) => {
    return transform.transform(list, [
        'announce_id',
        'announce_title',
        'description',
        'published_date',
        'created_date',
        'total_view',
        'is_read',
        'fullname',
        'created_user',
        'total_view',
        'is_read',
        'default_picture_url'
    ]);
};
const reviewUserList = (reviewUser = []) => {
    return transform.transform(reviewUser, ['avatar', 'name', 'review_status', 'announce_id']);
};

// const listStocksType = (users = []) => {
//     return transform.transform(users, [
//         'stocks_type_id',
//         'stocks_type_name',
//         'is_company',
//         'is_agency',
//         'is_manufacturer',
//         'is_supplier',
//     ]);
// };

const listCompany = (users = []) => {
    return transform.transform(users, ['company_id', 'company_name']);
};

// const optionsStore = (users = []) => {
//     return transform.transform(users, [
//         'store_id',
//         'store_code',
//         'store_name',
//         'business_name',
//         'company_name',
//         'company_id',
//         'business_id',
//         'phone_number',
//     ]);
// };
const detail = data => {
    return transform.transform(data, [
        'announce_id',
        'announce_type_id',
        'account_type_name',
        'announce_title',
        'description',
        'announce_content',
        'company_id',
        'company_name',
        'is_send_to_all',
        'created_date',
        'fullname',
        'is_read',
        'published_date',
    ]);
};

const attachmentDetail = data => {
    return transform.transform(data, ['attachment_path', 'attachment_name']);
};

const attachmentList = (attachmentList = []) => {
    return transform.transform(attachmentList, ['attachment_name', 'announce_attachment_id','announce_id']);
};

const reviewLevelList = (reviewLevelList = []) => {
    return transform.transform(reviewLevelList, ['announce_review_id']);
};
const listDepartment = (departmentList = []) => {
    const template = {
        id: '{{#? DEPARTMENTID}}',
        name: '{{#? DEPARTMENTNAME}}',
        value: '{{#? DEPARTMENTID}}',
        label: '{{#? DEPARTMENTNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(departmentList, Object.keys(template));
};

const listUser = (userList = []) => {
    const template = {
        id: '{{#? USERNAME}}',
        name: '{{#? FULLNAME}}',
        value: '{{#? USERNAME}}',
        label: '{{#? FULLNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(userList, Object.keys(template));
    // return transform.transform(userList, ['username', 'fullname']);
};
// const listDepartment = (user = []) => {
//     const template = new Transform({
//         department_id: '{{#? DEPARTMENTID}}',
//         department_name: '{{#? DEPARTMENTNAME}}',
//     });
//     let transform = new Transform(transform);
//     return transform.transform(user, Object.keys(template));
// };

// const listUser = (user = []) => {
//     const template = new Transform({
//         username: '{{#? USERNAME}}',
//         fullname: '{{#? FULLNAME}}',
//     });
//     let transform = new Transform(transform);
//     return transform.transform(user, Object.keys(template));
// };

const optionsAnnounceType = (users = []) => {
    return transform.transform(users, ['announce_type_id', 'announce_type_name']);
};
const listReviewLevel = (user = []) => {
    const template = {
        // announce_type_review_level_id: '{{#? ANNOUNCETYPEREVIEWLEVELID}}',
        announce_review_level_id: '{{#? ANNOUNCEREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        // is_auto_reviewed: '{{ISAUTOREVIEW? 1: 0}}',
        is_completed_reviewed: '{{ISCOMPLETEREVIEW? 1 : 0}}',
        order_index: '{{ORDERINDEX ? ORDERINDEX : 0}}',
        is_auto_review: '{{ISAUTOREVIEW? 1 : 0}}',
        review_user: '{{#? REVIEWUSER}}',
        is_review: '{{ISREVIEW? ISREVIEW : 0}}',
        review_note: '{{#? REVIEWNOTE}}',
        review_date: '{{#? REVIEWDATE}}',
        announce_review_id: '{{#? ANNOUNCEREVIEWID}}',
        // user_review_list: '{{#? USERREVIEWLIST.split("|")}}',
        // user_review_list_name: '{{#? USERREVIEWLISTNAME.split("|")}}',
        // stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    };
    let transform = new Transform(template);
    return transform.transform(user, Object.keys(template));
};

const listReviewUser = (user = []) => {
    let transform = new Transform({
        announce_review_level_id: '{{#? ANNOUNCEREVIEWLEVELID}}',
        id: '{{#? USERNAME}}',
        name: '{{#? FULLNAME}}',
        review_user: '{{#? REVIEWUSER}}',
        // is_auto_review: '{{ISAUTOREVIEW? 1 : 0}}',
        // order_index: '{{ORDERINDEX ? ORDERINDEX : 0}}',
    });
    return transform.transform(user, [
        'announce_review_level_id',
        'id',
        'name',
        'user_name',
        'review_user',
        // 'is_auto_review',
        // 'order_index',
    ]);
};

module.exports = {
    detail,
    attachmentDetail,
    attachmentList,
    reviewLevelList,
    // options,
    list,
    listAnnounceView,
    reviewUserList,
    // listStocksType,
    listCompany,
    listUser,
    listDepartment,
    optionsAnnounceType,
    listReviewLevel,
    listReviewUser,
    // optionsUser,
};
