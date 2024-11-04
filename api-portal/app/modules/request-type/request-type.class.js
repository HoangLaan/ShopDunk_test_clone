const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    request_type_id: '{{#? REQUESTTYPEID}}',
    request_type_name: '{{#? REQUESTTYPENAME}}',
    request_type_code: '{{#? REQUESTTYPECODE}}',
    is_warranty_genuine: '{{ISWARRANTYGENUINE ? ISWARRANTYGENUINE : 0}}',
    is_warranty_care: '{{ISWARRANTYHCARE ? ISWARRANTYHCARE : 0}}',
    is_repair_services: '{{ISREPAIRSERVICES ? ISREPAIRSERVICES : 0}}',
    is_divide_component: '{{ISDIVIDECOMPONENT ? ISDIVIDECOMPONENT : 0}}',
    is_repair_outside: '{{ISREPAIROUTSIDE ? ISREPAIROUTSIDE : 0}}',
    add_func_id: '{{#? ADDFUNCTIONID}}',
    edit_func_id: '{{#? EDITFUNCTIONID}}',
    delete_func_id: '{{#? DELETEFUNCTIONID}}',
    view_func_id: '{{#? VIEWFUNCTIONID}}',
    description: '{{#? DESCRIPTION}}',
    create_date: '{{#? CREATEDDATE}}',
    create_user: '{{#? CREATEDUSER}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

};
let transform = new Transform(template);
const list = (data = []) => {
    return transform.transform(data, [
        "request_type_id", "request_type_name",
        "request_type_code", "description", "is_warranty_genuine",
        "is_warranty_care", "is_repair_services","is_divide_component",
        "create_date", "create_user", "is_active","is_repair_outside"
    ]);
};


const detail = (data = []) => {
    return transform.transform(data, [
        "request_type_id", "request_type_name",
        "request_type_code", "description", "is_warranty_genuine","is_divide_component","is_repair_outside",
        "is_warranty_care", "is_repair_services", "add_func_id",
        "edit_func_id", "delete_func_id", "view_func_id",
        "create_date", "create_user", "is_active", "is_system"
    ]);
};

const process_step = (data = []) => {

    let process_step = new Transform({
        request_type_ps_step_id: '{{#? REQUESTTYPEPSTEPID}}',
        process_step_id: '{{#? PROCESSSTEPID}}',
        color: '{{#? COLOR}}',
        process_step_name: '{{#? PROCESSSTEPNAME}}',
        process_step_code: '{{#? PROCESSSTEPCODE}}',
        request_type_id: '{{#? REQUESTTYPEID}}',
        is_cancel: '{{#? ISCANCEL}}',
        is_complete: '{{#? ISCOMPLETE}}',
        min_process_time: '{{#? MINPROCESSTIME}}',
        max_process_time: '{{#? MAXPROCESSTIME}}',
        order_index: '{{#? ORDERINDEX}}',
    });

    return process_step.transform(data, [
        "request_type_ps_step_id", "process_step_id", "color", "process_step_name",
        "process_step_code", "request_type_id", "is_cancel",
        "is_complete", "min_process_time", "max_process_time",
        "order_index"
    ]);
};

const process_step_move = (data = []) => {

    let process_step = new Transform({
        request_type_ps_step_id: '{{#? REQUESTTYPEPSTEPID}}',
        process_step_id: '{{#? PROCESSSTEPID}}',
        request_type_id: '{{#? REQUESTTYPEID}}',
        id: '{{#? PROCESSSTEPID}}',
        value: '{{#? PROCESSSTEPID}}',

    });

    return process_step.transform(data, [
        "request_type_ps_step_id", "process_step_id", "request_type_id", "id", "value"
    ]);
};


const department = (data = []) => {

    let process_step = new Transform({
        request_type_ps_step_id: '{{#? REQUESTTYPEPSTEPID}}',
        department_id: '{{#? DEPARTMENTID}}',
        request_type_id: '{{#? REQUESTTYPEID}}',
        id: '{{#? DEPARTMENTID}}',
        value: '{{#? DEPARTMENTID}}',

    });

    return process_step.transform(data, [
        "request_type_ps_step_id", "process_step_id", "request_type_id", "id", "value"
    ]);
};

const options = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        request_type_name: '{{#? REQUESTTYPENAME}}',
    });

    return transform.transform(data, [
        "id", "name","request_type_name"
    ]);
};

module.exports = {
    list,
    detail,
    options,
    process_step,
    process_step_move,
    department
};