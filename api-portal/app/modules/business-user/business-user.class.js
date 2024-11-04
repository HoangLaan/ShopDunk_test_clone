const Transform = require('../../common/helpers/transform.helper');

const template = {
    business_id: '{{#? BUSINESSID}}',
    user_id: '{{#? USERID}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    company_name: '{{#? COMPANYNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    gender: '{{#? GENDER}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    cluster_name : '{{#? CLUSTERNAME}}',
};

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        'business_id',
        'user_id',
        'user_name',
        'full_name',
        'department_name',
        'position_name',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'business_id',
        'user_id',
        'user_name',
        'company_name',
        'full_name',
        'department_name',
        'position_name',
        'business_name',
        'store_id',
        'store_name',
        'cluster_name'
    ]);
};

const listCompany = (companies = []) => {
    const template = {
        id: '{{#? COMPANYID}}',
        name: '{{#? COMPANYNAME}}',
    };
    const transform = new Transform(template);
    return transform.transform(companies, ['id', 'name']);
};

const listAllUser = (list = []) => {
    return transform.transform(list, [
        'user_id',
        'user_name',
        'phone_number',
        'full_name',
        'department_name',
        'position_name',
        'email',
        'gender'
    ]);
};

module.exports = {
    list,
    detail,
    listCompany,
    listAllUser
};
