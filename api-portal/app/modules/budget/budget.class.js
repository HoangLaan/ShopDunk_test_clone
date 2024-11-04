const Transform = require('../../common/helpers/transform.helper');

const template = {
    budget_id: '{{#? BUDGETID}}',
    budget_type_id: '{{#? BUDGETTYPEID}}',
    budget_type_code: '{{#? BUDGETTYPECODE}}',
    parent_id: '{{#? PARENTID}}',
    short_name: '{{#? SHORTNAME}}',
    budget_name: '{{#? BUDGETNAME }}',
    budget_code: '{{#? BUDGETCODE}}',
    is_dynamic_budget: '{{ISDYNAMICBUDGET ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    note: '{{#? NOTE}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',

    parent_name: '{{#? PARENTNAME}}',
    parent_budget_code: '{{#? PARENTBUDGETCODE}}',

    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'budget_id',
        'budget_type_id',
        'parent_id',
        'short_name',
        'budget_name',
        'budget_code',
        'is_dynamic_budget',
        'description',
        'note',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'budget_id',
        'budget_type_id',
        'budget_type_code',
        'parent_id',
        'parent_name',
        'short_name',
        'budget_name',
        'is_dynamic_budget',
        'budget_code',
        'description',
        'note',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const parentOptions = (data = []) => {
    let transform = new Transform({
        value: '{{#? ID}}',
        title: '{{#? NAME}}',
        id: '{{#? ID}}',
        pId: '{{PARENTID ? PARENTID : 0}}',
        isLeaf: '{{ISLEAF ? 1 : 0}}',
    });
    return transform.transform(data, ['value', 'title', 'id', 'pId', 'isLeaf']);
};

const budgetRuleList = (list = []) => {
    const template = {
        budget_rule_id: '{{#? BUDGETRULEID}}',
        rule_id: '{{#? RULEID}}',
        budget_id: '{{#? BUDGETID}}',
        budget_value: '{{#? BUDGETVALUE}}',
        measure: '{{#? MEASURE}}',
        criteria: '{{#? CRITERIA}}',
        date_from: '{{#? DATEFROM}}',
        date_to: '{{#? DATETO}}',
        budget_value_type: '{{#? BUDGETVALUETYPE}}',
    };
    let transform = new Transform(template);

    return transform.transform(list, [
        'budget_rule_id',
        'budget_rule_name',
        'budget_value',
        'measure',
        'criteria',
        'date_from',
        'date_to',
        'budget_id',
        'rule_id',
        'budget_value_type',
    ]);
};

module.exports = {
    detail,
    list,
    budgetRuleList,
    parentOptions,
};
