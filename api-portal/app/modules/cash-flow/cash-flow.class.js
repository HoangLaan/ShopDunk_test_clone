const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    cash_flow_id: '{{#? CASHFLOWID}}',
    cash_flow_code: '{{#? CASHFLOWCODE}}',
    cash_flow_name: '{{#? CASHFLOWNAME}}',
    implicit_account_id: '{{#? IMPLICITACCOUNTID}}',
    implicit_account_name: '{{#? IMPLICITACCOUNTNAME}}',
    parent_id: '{{#? PARENTID}}',
    parent_name: '{{#? PARENTNAME}}',
    company_id: '{{#? COMPANYID}}',
    description: '{{#? DESCRIPTION}}',
    note: '{{#? NOTE}}',
    cash_flow_type: '{{#? CASHFLOWTYPE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    company_name: '{{#? COMPANYNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'cash_flow_id',
        'cash_flow_code',
        'cash_flow_name',
        'implicit_account_id',
        'parent_id',
        'parent_name',
        'company_id',
        'cash_flow_type',
        'description',
        'note',
        'is_active',
        'is_system',
    ]);
};

const list = (list = [], is_export = false) => {
    return transform.transform(
        list,
        is_export
            ? [
                  'cash_flow_id',
                  'cash_flow_code',
                  'cash_flow_name',
                  'company_name',
                  'implicit_account_name',
                  'parent_name',
                  'cash_flow_type',
                  'description',
                  'note',
                  'created_user',
                  'created_date',
                  'is_active',
              ]
            : [
                  'cash_flow_id',
                  'cash_flow_code',
                  'cash_flow_name',
                  'company_name',
                  'created_user',
                  'created_date',
                  'is_active',
              ],
    );
};

module.exports = {
    detail,
    list,
};
