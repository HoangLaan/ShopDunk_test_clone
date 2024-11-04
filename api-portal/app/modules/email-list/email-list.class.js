const Transform = require('../../common/helpers/transform.helper');

const template = {
    email_list_id: '{{#? EMAILLISTID }}',
    email_list_name: '{{#? EMAILLISTNAME }}',
    email_list_type: '{{#? EMAILLISTTYPE}}',
    customer_count: '{{#? CUSTOMERCOUNT}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, ['email_list_id', 'email_list_name', 'email_list_type', 'description']);
};

const list = (list = []) => {
    return transform.transform(list, [
        'email_list_id',
        'email_list_name',
        'email_list_type',
        'customer_count',
        'description',
        'created_user',
        'created_date',
    ]);
};

const customerDetail = (obj) => {
    const template = {
        email_list_id: '{{#? EMAILLISTID }}',
        customer_id: '{{#? CUSTOMERID }}',
        customer_phone: '{{#? CUSTOMERPHONE }}',
        customer_email: '{{#? CUSTOMEREMAIL }}',
        customer_name: '{{#? CUSTOMERNAME }}',
    };
    let transform = new Transform(template);
    return transform.transform(obj, [
        'email_list_id',
        'customer_id',
        'customer_phone',
        'customer_email',
        'customer_name',
    ]);
};

module.exports = {
    detail,
    list,
    customerDetail,
};
