const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    proposal_id: '{{#? PROPOSALID}}',
    proposal_type_id: '{{#? PROPOSALTYPEID}}',
    proposal_type_name: '{{#? PROPOSALTYPENAME}}',
    proposal_type: '{{#? PROPOSALTYPE}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
    user_name: '{{#? USERNAME}}',
    user_name_manager: '{{#? USERNAMEMANAGER}}',
    full_name: '{{#? FULLNAME}}',
    user_level_id: '{{#? USERLEVELID}}',
    contract_type_id: '{{#? CONTRACTTYPEID}}',
    change_type: '{{#? CHANGETYPE}}',
    effective_date: '{{#? EFFECTIVEDATE}}',
    reason: '{{#? REASON}}',
    proposed_salary: '{{#? PROPOSEDSALARY}}',
    working_time: '{{#? WORKINGTIME}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_show_review: '{{ISSHOWREVIEW ? 1 : 0}}',
    is_review: '{{ISREVIEW === 0 ? 0 : ISREVIEW === 1? 1: ISREVIEW}}',
    //
    proposal_review_list_id: '{{#? PROPOSALREVIEWLISTID}}',
    proposal_review_level_id: '{{#? PROPOSALREVIEWLEVELID}}',
    proposal_review_level_name: '{{#? PROPOSALREVIEWLEVELNAME}}',
    is_complete: '{{ISCOMPLETE ? 1: 0}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1: 0}}',
    review_user: '{{#? REVIEWUSER}}',
    avatar_image: [
        {
            '{{#if AVATARIMAGE}}': `${config.domain_cdn}{{AVATARIMAGE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    level_name: '{{#? LEVELNAME}}',
    birthday: '{{#? BIRTHDAY}}',
    nation_name: '{{#? NATIONNAME}}',
    start_work: '{{#? STARTWORK}}',
    country_name: '{{#? COUNTRYNAME}}',
    identity_number: '{{#? IDENTITYNUMBER}}',
    identity_place: '{{#? IDENTITYPLACE}}',
    identity_date: '{{#? IDENTITYDATE}}',
    permanent_address: '{{#? PERMANENTADDRESS}}',
    contract_no: '{{#? CONTRACTNO}}',
    contract_type_name: '{{#? CONTRACTTYPENAME}}',
    hard_salary: '{{#? HARDSALARY}}',
    code: '{{#? CODE}}',
    total_reviewed: '{{#? TOTALREVIEWED}}',
    total_not_reviewed: '{{#? TOTALNOTREVIEWED}}',
    total_review: '{{#? TOTALREVIEW}}',
};

const defaultFields = [
    'proposal_id',
    'proposal_type_name',
    'department_name',
    'position_name',
    'full_name',
    'effective_date',
    'is_review',
    'is_show_review',
    'is_system',
    'is_active',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'user_name',
        'proposal_type_id',
        'department_id',
        'account_parent_id',
        'created_user',
        'position_id',
        'user_level_id',
        'contract_type_id',
        'change_type',
        'effective_date',
        'reason',
        'proposed_salary',
        'working_time',
        'user_name_manager',
        'created_user',
        'create_date',
        'proposal_type',
    ]);
};

const total = (data = {}) => transform.transform(data, ['total_reviewed', 'total_not_reviewed', 'total_review']);

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listReview = (data = []) => {
    return transform.transform(data, [
        'proposal_review_level_id',
        'proposal_review_level_name',
        'is_complete',
        'is_auto_review',
        'review_user',
        'is_show_review',
        'is_review',
        'proposal_review_list_id',
    ]);
};

const listUser = (data = []) => {
    return transform.transform(data, [
        'proposal_id',
        'review_user',
        'full_name',
        'proposal_review_level_id',
        'avatar_image',
        'is_review',
    ]);
};

const detailUser = (data) =>
    transform.transform(data, [
        'department_name',
        'position_name',
        'level_name',
        'start_work',
        'contract_no',
        'contract_type_name',
        'birthday',
        'nation_name',
        'country_name',
        'permanent_address',
        'identity_number',
        'identity_place',
        'identity_date',
        'start_work',
        'hard_salary',
        'full_name',
        'code',
    ]);
module.exports = {
    detail,
    list,
    listReview,
    listUser,
    detailUser,
    total,
};
