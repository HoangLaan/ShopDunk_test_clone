const Transform = require('../../common/helpers/transform.helper');

const template = {
    contract_type_id: '{{#? CONTRACTTYPEID}}',
    contract_type_code: '{{#? CONTRACTTYPECODE}}',
    contract_type_name: '{{#? CONTRACTTYPENAME}}',
    company_id: '{{#? COMPANYID}}',
    description: '{{#? DESCRIPTION}}',
    is_apply_contract_term: '{{ISAPPLYCONTRACTTERM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
};
let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        'contract_type_id',
        'contract_type_code',
        'contract_type_name',
        'company_id',
        'description',
        'is_apply_contract_term',
        'is_active',
        'is_system',
    ]);
};

module.exports = {
    detail,
};
