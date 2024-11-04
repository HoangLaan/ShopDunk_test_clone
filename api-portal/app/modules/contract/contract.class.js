const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    contract_id: '{{#? CONTRACTID}}',
    contract_no: '{{#? CONTRACTNO}}',
    contract_name: '{{#? CONTRACTNAME}}',
    company_id: '{{#? COMPANYID}}',
    working_form_id: '{{#? WORKINGFORMID}}',
    contract_type_id: '{{#? CONTRACTTYPEID}}',
    contract_term_id: '{{#? CONTRACTTERMID}}',
    attachment_name: '{{#? ATTACHMENTNAME}}',
    attachment_path: [
        {
            '{{#if ATTACHMENTPATH}}': `${config.domain_cdn.slice(0, -1)}{{ATTACHMENTPATH}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    content: '{{#? CONTENT}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',

    company_name: '{{#? COMPANYNAME}}',
    contract_type_name: '{{#? CONTRACTTYPENAME}}',
    working_form_name: '{{#? WORKINGFORMNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'contract_id',
        'contract_no',
        'contract_name',
        'company_id',
        'working_form_id',
        'contract_type_id',
        'contract_term_id',
        'attachment_name',
        'content',
        'is_active',
    ]);
};

const attachmentDetail = (obj) => {
    return transform.transform(obj, ['attachment_name', 'attachment_path']);
};

const list = (list = []) => {
    return transform.transform(list, [
        'contract_id',
        'contract_no',
        'contract_name',
        'company_name',
        'contract_type_name',
        'working_form_name',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

module.exports = {
    detail,
    attachmentDetail,
    list,
};
