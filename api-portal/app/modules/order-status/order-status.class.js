const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const { SL_ORDERSTATUS_ISNEWORDER } = require('../../common/const/procedureName.const');

const template = {
    order_status_id: '{{#? ORDERSTATUSID}}',
    order_status_name: '{{#? STATUSNAME}}',
    status_name_cn: '{{#? STATUSNAMECN}}',
    description: '{{#? DESCRIPTION}}',
    icon: `${config.domain_cdn}{{ICONURL}}`,
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_new_order: '{{ISNEWORDER ? 1 : 0}}',
    is_confirm: '{{ISCONFIRM ? 1 : 0}}',
    is_process: '{{ISPROCESS ? 1 : 0}}',
    is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    is_cancel: '{{ISCANCEL ? 1 : 0}}',
    formality: `{{#? FORMALITY}}`,
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    add_function_id: '{{#? ADDFUNCTIONID}}',
    view_function_id: '{{#? VIEWFUNCTIONID}}',
    edit_function_id: '{{#? EDITFUNCTIONID}}',
    delete_function_id: '{{#? DELETEFUNCTIONID}}',

    type: '{{#? STATUSTYPE}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    type_name: '{{#? TYPENAME}}',
};

const templateOption = {
    id: '{{#? ORDERSTATUSID}}',
    name: '{{#? STATUSNAME}}',
};

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        'order_status_id',
        'order_status_name',
        'status_name_cn',
        'icon',
        'description',
        'is_active',
        'formality',
        'company_id',
        'view_function_id',
        'add_function_id',
        'edit_function_id',
        'delete_function_id',
        'is_system'
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'order_status_id',
        'order_status_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'company_name',
        'type_name',
        'is_new_order',
    ]);
};

const option = (data = []) => {
    let transform = new Transform(templateOption);
    return transform.transform(data, ['id', 'name']);
};

const informationWithOrders = (data = []) => {
    const templateOption = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        function_alias: '{{#? FUNCTIONALIAS}}',
        number_order: '{{NUMBERORDER ?? 0}}'
    }
    let transform = new Transform(templateOption);
    return transform.transform(data, Object.keys(templateOption));
};


module.exports = {
    list,
    detail,
    option,
    informationWithOrders
};
