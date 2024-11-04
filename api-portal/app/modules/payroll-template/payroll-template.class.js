const Transform = require('../../common/helpers/transform.helper');
const template = {
    template_id: '{{#? TEMPLATEID}}',
    template_name: '{{#? TEMPLATENAME}}',
    description: '{{#? DESCRIPTION}}',
    is_show: '{{ISSHOW ? 1 : 0}}',
    display_name: '{{#? DISPLAYNAME}}',

    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',

    // salary element
    element_id: '{{#? ELEMENTID}}',
    element_code: '{{#? ELEMENTCODE}}',
    element_name: '{{#? ELEMENTNAME}}',
    element_type: '{{#? ELEMENTTYPE}}',
    property: '{{#? PROPERTY}}',
    element_value: '{{#? ELEMENTVALUE}}',
};

const transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'template_id',
        'template_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const listSalaryElement = (list = []) => {
    return transform.transform(list, [
        'element_id',
        'element_code',
        'element_name',
        'element_type',
        'property',
        'element_value',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const listSEByPayrollTemplate = (list = []) => {
    return transform.transform(list, [
        'element_id',
        'element_code',
        'element_name',
        'element_value',
        'is_show',
        'display_name',
    ]);
};

const detail = (list = []) => {
    return transform.transform(list, [
        'template_id',
        'template_name',
        'company_id',
        'block_id',
        'department_id',
        'description',
        'position_list',
        'position_level_list',
        'is_active',
        'is_system',
    ]);
};

module.exports = {
    list,
    listSalaryElement,
    detail,
    listSEByPayrollTemplate,
};
