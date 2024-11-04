const Transform = require('../../common/helpers/transform.helper');

const template = {
    department_id: '{{#? DEPARTMENTID}}',
    budget_id: '{{#? BUDGETID}}',
    budget_name: '{{#? BUDGETNAME}}',
    budget_code: '{{#? BUDGETCODE}}',
    company_name: '{{#? COMPANYNAME}}',
    item_codes: '{{#? ITEMCODES}}',

    january_plan: '{{JANUARYPLAN ? JANUARYPLAN : 0}}',
    january_used: '{{JANUARYUSED ? JANUARYUSED : 0}}',
    february_plan: '{{FEBRUARYPLAN ? FEBRUARYPLAN : 0}}',
    february_used: '{{FEBRUARYUSED ? FEBRUARYUSED : 0}}',
    march_plan: '{{MARCHPLAN ? MARCHPLAN : 0}}',
    march_used: '{{MARCHUSED ? MARCHUSED : 0}}',
    april_plan: '{{APRILPLAN ? APRILPLAN : 0}}',
    april_used: '{{APRILUSED ? APRILUSED : 0}}',
    may_plan: '{{MAYPLAN ? MAYPLAN : 0}}',
    may_used: '{{MAYUSED ? MAYUSED : 0}}',
    june_plan: '{{JUNEPLAN ? JUNEPLAN : 0}}',
    june_used: '{{JUNEUSED ? JUNEUSED : 0}}',
    july_plan: '{{JULYPLAN ? JULYPLAN : 0}}',
    july_used: '{{JULYUSED ? JULYUSED : 0}}',
    august_plan: '{{AUGUSTPLAN ? AUGUSTPLAN : 0}}',
    august_used: '{{AUGUSTUSED ? AUGUSTUSED : 0}}',
    september_plan: '{{SEPTEMBERPLAN ? SEPTEMBERPLAN : 0}}',
    september_used: '{{SEPTEMBERUSED ? SEPTEMBERUSED : 0}}',
    october_plan: '{{OCTOBERPLAN ? OCTOBERPLAN : 0}}',
    october_used: '{{OCTOBERUSED ? OCTOBERUSED : 0}}',
    november_plan: '{{NOVEMBERPLAN ? NOVEMBERPLAN : 0}}',
    november_used: '{{NOVEMBERUSED ? NOVEMBERUSED : 0}}',
    december_plan: '{{DECEMBERPLAN ? DECEMBERPLAN : 0}}',
    december_used: '{{DECEMBERUSED ? DECEMBERUSED : 0}}',

    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',

    budget_plan_name: '{{#? BUDGETPLANNAME}}',
    company_id: '{{#? COMPANYID}}',
    from_month: '{{#? FROMMONTH}}',
    from_year: '{{#? FROMYEAR}}',
    to_month: '{{#? TOMONTH}}',
    to_year: '{{#? TOYEAR}}',
    is_apply_all_department: '{{#? ISAPPLYALLDEPARTMENT}}',
    created_user: '{{#? CREATEDUSER}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',

    budget_plan_id: '{{#? BUDGETPLANID}}',
    row_span: '{{ROWSPAN ? ROWSPAN : 0}}',
    budget_plan_distribution_id: '{{#? BUDGETPLANDISTRIBUTIONID}}',
    is_review: '{{ ISREVIEW ? ISREVIEW : 0}}',
    note: '{{#? NOTE}}',
    is_dynamic_budget: '{{ISDYNAMICBUDGET ? 1 : 0}}',

    budget_plan_distribution_detail_id: '{{#? BUDGETPLANDISTRIBUTIONDETAILID}}',
    budget_plan_distribution_date: '{{#? BUDGETPLANDISTRIBUTIONDATE}}',
    budget_plan_distribution_used: '{{ BUDGETPLANDISTRIBUTIONUSED ? BUDGETPLANDISTRIBUTIONUSED : 0 }}',
    budget_plan_distribution_plan: '{{ BUDGETPLANDISTRIBUTIONPLAN ? BUDGETPLANDISTRIBUTIONPLAN : 0}}',

    budget_plan_date_from: '{{#? BUDGETPLANDATEFROM}}',
    budget_plan_date_to: '{{#? BUDGETPLANDATETO}}',

};

const detailFields = [
    'budget_plan_name',
    'company_id',
    'from_month',
    'from_year',
    'to_month',
    'to_year',
    'is_apply_all_department',
    'created_user',
    'is_active',
    'created_date',
];

let transform = new Transform(template);

const budgetList = (list = []) => {
    return transform.transform(list, [
        'department_id',
        'budget_id',
        'budget_name',
        'budget_code',
        'company_name',
        'item_codes',

        'january_plan',
        'january_used',
        'february_plan',
        'february_used',
        'march_plan',
        'march_used',
        'april_plan',
        'april_used',
        'may_plan',
        'may_used',
        'june_plan',
        'june_used',
        'july_plan',
        'july_used',
        'august_plan',
        'august_used',
        'september_plan',
        'september_used',
        'october_plan',
        'october_used',
        'november_plan',
        'november_used',
        'december_plan',
        'december_used',
    ]);
};

const departmentList = (list = []) => {
    return transform.transform(list, ['department_id', 'department_name']);
};

const detail = (data) => {
    return transform.transform(data, detailFields);
};

const totalTemplate = {
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    total_budget_distribution: '{{#? TOTALBUDGETDISTRIBUTION}}',
    total_budget_used: '{{#? TOTALBUDGETUSED}}',
    remain: '{{#? REMAIN}}',
};

let transformTotal = new Transform(totalTemplate);

const listTotal = (data = []) => {
    return transformTotal.transform(data, [
        'department_id',
        'department_name',
        'total_budget_distribution',
        'total_budget_used',
        'remain',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'budget_plan_id',
        'budget_plan_name',
        'budget_name',
        'budget_code',
        'department_id',
        'department_name',
        'company_name',
        'row_span',
        'budget_plan_distribution_id',
        'company_id',
        'is_dynamic_budget',
        'budget_plan_date_from',
        'budget_plan_date_to'

    ]);
};

const options = (data = []) => {
    let transform = new Transform({
        'value': '{{#? ID}}',
        'title': '{{#? NAME}}',
        'id': '{{#? ID}}',
        'pId': '{{PARENTID ? PARENTID : 0}}',
        'isLeaf': '{{ISLEAF ? 1 : 0}}',
    });
    return transform.transform(data, [
        'value', 'title', 'id', 'pId', 'isLeaf'
    ]);
}

const option = (data = []) => {
    let transform = new Transform({
        'id': '{{#? ID}}',
        'name': '{{#? NAME}}',
    });
    return transform.transform(data, [
        'id', 'name',
    ]);
};

const listOption = (data = []) => {
    return transform.transform(data, [
        'budget_plan_id',
        'budget_plan_name',
        'created_user',
        'created_date',
        'is_review',
        'is_active',
        'note',
        'budget_plan_date_from',
        'budget_plan_date_to',
        'company_id'

    ]);
};

const listDistributionOption = (data = []) => {
    return transform.transform(data, [
        'budget_plan_distribution_detail_id',
        'budget_plan_distribution_date',
        'budget_plan_distribution_used',
        'budget_plan_distribution_id',
        'budget_plan_distribution_plan'
    ]);
};

const detailBudgetPlan = (data = []) => {
    return transform.transform(data, [
        'budget_plan_id',
        'budget_plan_name',
        'company_id',
        'is_active',
        'budget_plan_date_from',
        'budget_plan_date_to',

    ]);
};

const departmentAndBudget = (data = []) => {
    return transform.transform(data, [
        'budget_plan_id',
        'department_id',
        'budget_id',
        'budget_plan_distribution_id'

    ]);
};


module.exports = {
    budgetList,
    departmentList,
    detail,
    listTotal,
    list,
    options,
    option,
    listOption,
    listDistributionOption,
    detailBudgetPlan,
    departmentAndBudget
};
