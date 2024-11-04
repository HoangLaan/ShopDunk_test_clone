const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const list = (list = []) => {
    let transform = new Transform({
        regime_type_id: '{{#? REGIMETYPEID}}',
        regime_type_code: '{{#? REGIMETYPECODE}}',
        regime_type_name: '{{#? REGIMETYPENAME}}',
        parent_name: '{{#? PARENTNAME}}',
        description: '{{#? DESCRIPTION}}',
        created_user: '{{#? CREATEDUSER}}',
        created_date: '{{#? CREATEDDATE}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
    });

    return transform.transform(list, [
        'regime_type_id',
        'regime_type_code',
        'regime_type_name',
        'parent_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const reviewLevelList = (list = []) => {
    let transform = new Transform({
        review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
        review_level_name: '{{#? REGIMEREVIEWLEVELNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        business_name: '{{#? BUSINESSNAME}}',
        description: '{{#? DESCRIPTION}}',
        created_user: '{{#? CREATEDUSER}}',
        created_date: '{{#? CREATEDDATE}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
    });

    return transform.transform(list, [
        'review_level_id',
        'review_level_name',
        'company_name',
        'business_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
    ]);
};

const departmentList = (list = []) => {
    let transform = new Transform({
        review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
        department_id: '{{#? DEPARTMENTID}}',
        department_name: '{{#? DEPARTMENTNAME}}',
    });

    return transform.transform(list, ['review_level_id', 'department_id', 'department_name']);
};

const positionList = (list = []) => {
    let transform = new Transform({
        review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
        department_id: '{{#? DEPARTMENTID}}',
        position_id: '{{#? POSITIONID}}',
        position_name: '{{#? POSITIONNAME}}',
    });

    return transform.transform(list, ['review_level_id', 'department_id', 'position_id', 'position_name']);
};

const detail = (data) => {
    let transform = new Transform({
        regime_type_id: '{{#? REGIMETYPEID}}',
        regime_type_code: '{{#? REGIMETYPECODE}}',
        regime_type_name: '{{#? REGIMETYPENAME}}',
        parent_id: {
            value: '{{#? PARENTID}}',
            label: '{{#? PARENTNAME}}',
        },
        policy: '{{#? POLICY}}',
        description: '{{#? DESCRIPTION}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        is_system: '{{ISSYSTEM ? 1 : 0}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    });

    return transform.transform(data, [
        'regime_type_id',
        'regime_type_name',
        'regime_type_code',
        'parent_id',
        'policy',
        'description',
        'is_active',
        'is_system',
        'is_auto_review',
    ]);
};

const levelUserDetailList = (list = []) => {
    let transform = new Transform({
        review_level_id: '{{#? REGIMEREVIEWLEVELID}}',
        review_level_name: '{{#? REGIMEREVIEWLEVELNAME}}',
        user_review_list: '{{#? USERREVIEWLIST}}',
        is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
        is_complete_review: '{{ISCOMPLETE ? 1 : 0}}',
        order_index: '{{ ORDERINDEX ? ORDERINDEX : 0}}',
    });

    return transform.transform(list, [
        'review_level_id',
        'review_level_name',
        'user_review_list',
        'is_auto_review',
        'is_complete_review',
        'order_index',
    ]);
};

const option = (data) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });

    return transform.transform(data, ['id', 'name']);
};

module.exports = {
    list,
    detail,
    levelUserDetailList,
    option,
    reviewLevelList,
    departmentList,
    positionList,
};
