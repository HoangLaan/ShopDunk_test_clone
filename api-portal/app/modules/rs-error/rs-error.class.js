const Transform = require('../../common/helpers/transform.helper');

const template = {
    error_id: '{{#? ERRORID}}',
    error_name: '{{#? ERRORNAME}}',
    error_code: '{{#? ERRORCODE}}',
    error_group_id: '{{#? ERRORGROUPID}}',
    error_group_name: '{{#? ERRORGROUPNAME}}',
    error_group_code: '{{#? ERRORGROUPCODE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATEVIEW}}',
    is_deleted: '{{#? ISDELETED}}',
    description: '{{#? DESCRIPTION}}',
    is_system: '{{ISSYSTEM ? 1 : 0 }}',
    solution_error_id: '{{#? SOLUTIONERRORID}}',
    solution_id: '{{#? SOLUTIONID}}',
    solution_name: '{{#? SOLUTIONNAME}}',
    solution_group_id: '{{#? SOLUTIONGROUPID}}',
    solution_group_name: '{{#? SOLUTIONGROUPNAME}}',
    is_component_test: '{{ISCOMPONENTTEST ? 1 : 0}}',
    is_component_replace: '{{ISCOMPONENTREPLACE ? 1 : 0}}',
    reference_price: '{{#? REFERENCEPRICE}}',
    lowest_price: '{{#? LOWESTPRICE}}',
    highest_price: '{{#? HIGHESTPRICE}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'error_id',
        'error_code',
        'error_name',
        'error_group_id',
        'error_group_name',
        'is_active',
        'created_date',
        'created_user',
        'description',
        'is_system',
    ]);
};

const detail = (data = {}) => {
    return data && Object.keys(data).length > 0
        ? transform.transform(data, [
              'error_id',
              'error_name',
              'error_code',
              'error_group_id',
              'error_group_name',
              'is_active',
              'created_date',
              'created_user',
              'description',
              'is_system',
          ])
        : null;
};

const listSolution = (data = []) => {
    return transform.transform(data, [
        'error_id',
        'solution_error_id',
        'solution_id',
        'solution_name',
        'solution_group_name',
        'solution_group_id',
        'is_component_test',
        'is_component_replace',
        'reference_price',
        'lowest_price',
        'highest_price',
    ]);
};

const listOptionSolution = (data = []) => {
    return transform.transform(data, [
        'solution_id',
        'solution_name',
        'solution_group_name',
        'solution_group_id',
        'is_component_test',
        'is_component_replace',
        'reference_price',
        'lowest_price',
        'highest_price',
    ]);
};

module.exports = {
    list,
    detail,
    listSolution,
    listOptionSolution,
};
