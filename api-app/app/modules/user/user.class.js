const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    user_id: '{{#? USERID}}',
    full_name: '{{#? FULLNAME}}',
    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
    phone_number_1: '{{#? PHONENUMBER_1}}',
    address: '{{#? ADDRESS}}',
    address_full: '{{#? ADDRESSFULL}}',
    gender: '{{ GENDER ? 1 : 0 }}',
    default_picture_url: [
        {
            '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        },
        {
            '{{#else}}': `${config.domain_cdn}/uploads/d-book.png`,
        },
    ],
    user_name: '{{#? USERNAME}}',
    password: '{{#? PASSWORD}}',
    first_name: '{{#? FIRSTNAME}}',
    last_name: '{{#? LASTNAME}}',
    birthday: '{{#? BIRTHDAY }}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    country_id: '{{#? COUNTRYID}}',
    city_id: '{{#? CITYID}}',
    description: '{{#? DESCRIPTION}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_id: '{{#? POSITIONID}}',
    position_name: '{{#? POSITIONNAME}}',
    user_groups: '{{#? USERGROUPS.split("|")}}',
    about_me: '{{#? ABOUTME}}',
    updated_user: '{{#? UPDATEDUSER}}',
    created_user: '{{#? CREATEDUSER}}',
    province_name: '{{#? PROVINCENAME}}',
    district_name: '{{#? DISTRICTNAME}}',
    city_name: '{{#? CITYNAME}}',
    country_name: '{{#? COUNTRYNAME}}',
    ward_name: '{{#? WARDNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    is_notify: '{{ ISNOTIFY ? ISNOTIFY : 0 }}',
    entry_date: '{{#? ENTRYDATE}}',
    total_revenue: '{{ TOTALREVENUE ? TOTALREVENUE : 0 }}',
    total_order: '{{ TOTALORDER ? TOTALORDER : 0 }}',
    total_debit: '{{ TOTALDEBIT ? TOTALDEBIT : 0 }}',
    total_netweight: '{{ TOTALNETWEIGHT ? TOTALNETWEIGHT : 0 }}',
    total_customer_create_order: '{{ TOTALCUSTOMERCREATEORDER ? TOTALCUSTOMERCREATEORDER : 0 }}',

    company_name: '{{#? COMPANYNAME}}',
    user_companies: '{{#? COMPANY.split("|")}}',
    result: '{{ RESULT ? RESULT : 0 }}',
    message: '{{#? MESSAGE }}',
    device_token: '{{#? DEVICETOKEN }}',
    platform: '{{#? PLATFORM }}',

    // Hobbies
    hobbies_id: '{{#? HOBBIESID }}',
    hobbies_name: '{{#? HOBBIESNAME }}',
    hobbies: '{{#? HOBBIES }}',

    email_company: '{{#? EMAILCOMPANY }}',
};

let transform = new Transform(template);

const basicInfo = user => {
    return transform.transform(user, ['user_id', 'user_name', 'password', 'full_name', 'email', 'phone_number']);
};

const detail = user => {
    return transform.transform(user, [
        'user_id',
        'full_name',
        'email',
        'phone_number',
        'address',
        'gender',
        'default_picture_url',
        'user_name',
        'birthday',
        'entry_date',
        'province_name',
        'district_name',
        'country_name',
        'ward_name',
        'department_name',
        'position_name',
        'business_name',
        'user_companies',
        'description',
        'hobbies',
        'about_me',
        'email_company',
    ]);
};

const statistic = user => {
    return transform.transform(user, [
        'total_revenue',
        'total_customer_create_order',
        'total_netweight',
        'total_debit',
        'total_order',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'user_id',
        'user_name',
        'full_name',
        'department_name',
        'position_name',
        'default_picture_url',
        'phone_number',
    ]);
};

const generateUsername = user => {
    return transform.transform(user, ['user_name']);
};
const checktoken = user => {
    return transform.transform(user, ['result']);
};
// options
const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const options = (userGroups = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(userGroups, ['id', 'name']);
};

const getOptions = (data = []) => {
    return transform.transform(data, ['user_name', 'full_name', 'email', 'default_picture_url', 'department_id']);
};
const onoffNotify = (data = []) => {
    return transform.transform(data, ['message']);
};
const getDeviceTokenByUsername = (data = []) => {
    return transform.transform(data, ['device_token', 'platform']);
};
const userGroups = (groups = []) => {
    const transform = new Transform({
        user_id: '{{#? USERID}}',
        id: '{{#? USERGROUPID}}',
        value: '{{#? USERGROUPID}}',
    });
    return transform.transform(groups, ['id', 'user_id', 'value']);
};

const hobbiesOptions = (data = []) => {
    return transform.transform(data, ['hobbies_id', 'hobbies_name']);
};

module.exports = {
    basicInfo,
    detail,
    list,
    generateUsername,
    options,
    statistic,
    getOptions,
    checktoken,
    onoffNotify,
    getDeviceTokenByUsername,
    userGroups,
    hobbiesOptions,
};
