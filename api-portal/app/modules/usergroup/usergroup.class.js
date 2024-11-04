const Transform = require('../../common/helpers/transform.helper');

const template = {
    'user_group_id': '{{#? USERGROUPID}}',
    'user_group_name': '{{#? USERGROUPNAME}}',
    'business_id': '{{#? BUSINESSID + ""}}',
    'business_name': '{{#? BUSINESSNAME}}',
    'company_id': '{{#? COMPANYID + ""}}',
    'company_name': '{{#? COMPANYNAME}}',
    'description': '{{#? DESCRIPTION}}',
    'order_index': '{{#? ORDERINDEX}}',
    'is_active': '{{ISACTIVE ? 1 : 0}}',
    'is_system': '{{ISSYSTEM ? 1 : 0}}',
    'created_user': '{{#? CREATEDUSER}}',
    'created_date': '{{#? CREATEDDATE}}',
    'updated_user': '{{#? UPDATEDUSER}}',
    'updated_date': '{{#? UPDATEDDATE}}',
    'is_deleted': '{{#? ISDELETED}}',
    'deleted_user': '{{#? DELETEDUSER}}',
    'deleted_date': '{{#? DELETEDDATE}}',
    //   Options
    'id': '{{#? ID}}',
    'name': '{{#? NAME}}',
    'parent_id': '{{#? PARENTID}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'user_group_id', 'user_group_name', 'business_id', 'company_id', 'business_name', 'company_name', 'description', 'order_index', 'is_active', 'is_system',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'user_group_id', 'user_group_name', 'business_name', 'is_system', 'description',
        'order_index', 'is_active', 'business_id', 'company_id', 'company_name', 'created_date',
    ]);
};

const options = (usergroups = []) => {
    return transform.transform(usergroups, ['id', 'name', 'description', 'parent_id']);
}

module.exports = {
    detail,
    list,
    options
};
