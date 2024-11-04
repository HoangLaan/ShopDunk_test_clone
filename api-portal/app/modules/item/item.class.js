const Transform = require('../../common/helpers/transform.helper');

const template = {
    item_id: '{{#? ITEMID}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    parent_id: '{{#? PARENTID}}',
    item_name: '{{#? ITEMNAME}}',
    item_code: '{{#? ITEMCODE}}',
    budget_id: '{{#? BUDGETID}}',
    budget_code: '{{#? BUDGETCODE}}',
    is_budget_creation: '{{ISBUDGETCREATION ? 1 : 0}}',
    is_budget_adjustment: '{{ISBUDGETADJUSTMENT ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    note: '{{#? NOTE}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',

    parent_item_name: '{{#? PARENTITEMNAME}}',
    parent_item_code: '{{#? PARENTITEMCODE}}',

    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'item_id',
        'company_id',
        'parent_id',
        'item_name',
        'item_code',
        'budget_id',
        'is_budget_creation',
        'is_budget_adjustment',
        'description',
        'note',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
        'parent_item_name',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'item_id',
        'item_code',
        'item_name',
        'company_id',
        'company_name',
        'created_user',
        'created_date',
        'is_budget_creation',
        'is_budget_adjustment',
        'is_active',
        'budget_id',
        'budget_code',
        'parent_id',
        'parent_item_name',
        'parent_item_code',
    ]);
};

const options = (list = []) => {
    const template = {
        id: '{{#? ITEMID}}',
        name: '{{#? ITEMNAME}}',
        code: '{{#? ITEMCODE}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        parent_id: '{{#? PARENTID}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, ['id', 'name', 'is_active', 'code', 'parent_id']);
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

module.exports = {
    detail,
    list,
    options,
    parentOptions,
};
