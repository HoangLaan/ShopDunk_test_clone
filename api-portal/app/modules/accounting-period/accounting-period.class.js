const Transform = require('../../common/helpers/transform.helper');

const template = {
    accounting_period_id: '{{#? ACCOUNTINGPERIODID }}',
    accounting_period_name: '{{#? ACCOUNTINGPERIODNAME }}',
    apply_from_date: '{{#? APPLYFROMDATE}}',
    apply_to_date: '{{#? APPLYTODATE}}',
    company_id: '{{#? COMPANYID}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'accounting_period_id',
        'accounting_period_name',
        'company_id',
        'apply_from_date',
        'apply_to_date',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'accounting_period_id',
        'accounting_period_name',
        'company_id',
        'apply_from_date',
        'apply_to_date',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'is_system',
    ]);
};

module.exports = {
    detail,
    list,
};
