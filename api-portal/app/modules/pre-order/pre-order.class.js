const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    pre_order_id: '{{#? PREORDERID}}',
    order_id: '{{#? ORDERID}}',
    member_id: '{{#? MEMBERID}}',
    data_leads_id: '{{#? DATALEADSID}}',
    full_name: '{{#? FULLNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    gender: '{{GENDER ? GENDER : null}}',
    birthday: '{{#? BIRTHDAY}}',
    payment_status_type: '{{PAYMENTSTATUSTYPE ?PAYMENTSTATUSTYPE : 0}}',
    product_dislay_name: '{{#? PRODUCTDISPLAYNAME}}',
    zalo_id: '{{#? ZALOID}}',
    sent_zalo_oa_id: '{{#? SENTZALOOAID}}',
    date_interest: '{{#? DATEINTEREST}}',
    is_send_sms: '{{ISSENDSMS  ? 1 : 0}}',
    is_send_email: '{{ISSENDEMAIL  ? 1 : 0}}',
    is_send_zalo_oa: '{{ISSENDZALOOA  ? 1 : 0}}',
    task_detail_id: '{{#? TASKDETAILID}}',
};

let transform = new Transform(template);

const customers = (list) => {
    return transform.transform(list, [
        'member_id',
        'full_name',
        'phone_number',
        'email',
        'customer_code',
        'gender',
        'birthday',
        'zalo_id',
    ]);
};

const customersBuy15 = (list) => {
    return transform.transform(list, [
        'order_id',
        'pre_order_id',
        'member_id',
        'full_name',
        'phone_number',
        'email',
        'customer_code',
        'gender',
        'birthday',
        'payment_status_type',
        'product_dislay_name',
    ]);
};

const intertest_customers = (list) => {
    return transform.transform(list, [
        'member_id',
        'data_leads_id',
        'full_name',
        'phone_number',
        'email',
        'customer_code',
        'gender',
        'birthday',
        'is_send_sms',
        'is_send_email',
        'is_send_zalo_oa',
        'date_interest',
        'task_detail_id',
    ]);
};

module.exports = {
    customers,
    customersBuy15,
    intertest_customers,
};
