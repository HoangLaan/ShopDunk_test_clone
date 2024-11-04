const logger = require('../../common/classes/logger.class');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    request_using_budget_id: '{{#? REQUESTUSINGBUDGETID}}',
    request_using_budget_code: '{{#? REQUESTUSINGBUDGETCODE}}',
    full_name: '{{#? FULLNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    total_requset_budget: '{{#? TOTALREQUESTBUDGET}}',
    company_name: '{{#? COMPANYNAME}}',
    user_request: '{{#? USERREQUEST}}',
    department_id: '{{#? DEPARTMENTID}}',
    company_id: '{{#? COMPANYID}}',
    position_name: '{{#? POSITIONNAME}}',
    budget_type_id: '{{#? BUDGETTYPEID}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',

    // Mục tiêu
    budget_goal_id: '{{#? BUDGETGOALID}}',
    document_type_id: '{{#? DOCUMENTTYPEID}}',
    document_code: '{{#? DOCUMENTCODE}}',
    item_id: '{{#? ITEMID}}',
    explain: '{{#? EXPLAIN}}',
    request_budget: '{{#? REQUESTBUDGET}}',
    request_budget_review: '{{#? REQUESTBUDGETREVIEW}}',
    //Thông tin duyệt
    budget_review_list_id: '{{#? BUDGETREVIEWLISTID}}',
    budget_review_list_name: '{{#? BUDGETREVIEWLISTNAME}}',
    budget_type_review_level_id: '{{#? BUDGETTYPEREVIEWLEVELID}}',
    review_note: '{{#? REVIEWNOTE}}',
    review_user: '{{#? REVIEWUSER}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_complete: '{{ISCOMPLETE ? 1 : 0}}',

    // Ngân sách phân bổ
    total_budget_plan: '{{#? TOTALBUDGETPLAN}}',
    total_budget_used: '{{#? TOTALBUDGETUSED}}',
    //REQUEST_PURCHASE
    request_purchase_code: '{{#? REQUESTPURCHASECODE}}',
    request_purchase_id: '{{#? REQUESTPURCHASEID}}',
    description: '{{#? DESCRIPTION}}',
    //FI_item
    parent_id: '{{#? PARENTID}}',
    item_name: '{{#? ITEMNAME}}',
    item_code: '{{#? ITEMCODE}}',
    is_child: '{{#? ISCHILD}}',
    //
    user_review: '{{#? USERREVIEW}}',
    full_name: '{{#? FULLNAME}}',
    is_show_review: '{{ISSHOWREVIEW ? 1 : 0}}',
    is_review: '{{ISREVIEW === 0 ? 0 : ISREVIEW === 1? 1: ISREVIEW}}',
};

const defaultFields = [
    'request_using_budget_id',
    'request_using_budget_code',
    'full_name',
    'department_name',
    'total_requset_budget',
    'company_name',
    'is_review',
    'is_active',
    'create_date',
    'total_not_browse',
    'total_browsed',
    'is_show_review',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        ...defaultFields,
        'company_id',
        'department_id',
        'budget_type_id',
        'user_request',
        'position_name',
    ]);
};

const listBudgetGoal = (data) => {
    return transform.transform(data, [
        'budget_goal_id',
        'document_type_id',
        'document_code',
        'explain',
        'item_id',
        'request_budget',
        'request_budget_review',
    ]);
};

const listReview = (data) => {
    return transform.transform(data, [
        'budget_review_list_id',
        'budget_type_review_level_id',
        'budget_review_list_name',
        'request_using_budget_id',
        'is_review',
        'review_user',
        'is_auto_review',
        'review_note',
        'is_complete',
        'is_show_review',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const listBugetPlanDistribution = (data) => {
    return transform.transform(data, ['total_budget_plan', 'total_budget_used']);
};

const listRequestPurchase = (data = []) => {
    return transform.transform(data, ['request_purchase_code', 'request_purchase_id', 'description']);
};

const listUser = (data = []) => transform.transform(data, ['user_review', 'full_name', 'budget_type_review_level_id']);

const tree = (data = []) => {
    return transform.transform(data, ['item_id', 'item_name', 'item_code', 'parent_id', 'is_child']);
};

module.exports = {
    detail,
    list,
    listBudgetGoal,
    listReview,
    listBugetPlanDistribution,
    listRequestPurchase,
    tree,
    listUser,
};
