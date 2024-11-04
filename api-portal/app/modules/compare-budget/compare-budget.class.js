const Transform = require('../../common/helpers/transform.helper');

const template = {
    budget_id: '{{#? BUDGETID }}',
    budget_name: '{{#? BUDGETNAME }}',
    budget_code: '{{#? BUDGETCODE}}',
    budget_type_id: '{{#? BUDGETTYPEID}}',
    parent_id: '{{#? PARENTID}}',
    total_budget_from: '{{TOTALBUDGETFROM ? TOTALBUDGETFROM : 0 }}',
    total_budget_to: '{{TOTALBUDGETTO ? TOTALBUDGETTO : 0 }}',
    total_budget_plan: '{{TOTALBUDGETPLAN ? TOTALBUDGETPLAN : 0 }}',
    total_budget_used: '{{TOTALBUDGETUSED ? TOTALBUDGETUSED : 0 }}',
    budget_level: '{{#? LEVEL }}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'budget_id',
        'budget_name',
        'budget_code',
        'budget_type_id',
        'parent_id',
        'total_budget_from',
        'total_budget_to',
        'total_budget_plan',
        'total_budget_used',
    ]);
};

const sumtotal = (list = []) => {
    return transform.transform(list, [
        'budget_level',
        'total_budget_from',
        'total_budget_to',
        'total_budget_plan',
        'total_budget_used',
    ]);
};

const budgetPlanOptions = (list = []) => {
    const template = {
        id: '{{#? ID }}',
        name: '{{#? NAME }}',
        date_from: '{{#? BUDGETPLANDATEFROM}}',
        date_to: '{{#? BUDGETPLANDATETO}}',
    };

    let transform = new Transform(template);

    return transform.transform(list, ['id', 'name', 'date_from', 'date_to']);
};

module.exports = {
    list,
    sumtotal,
    budgetPlanOptions,
};
