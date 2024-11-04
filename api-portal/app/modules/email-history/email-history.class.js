const Transform = require('../../common/helpers/transform.helper');

const template = {
    email_history_id: '{{#? EMAILHISTORYID }}',
    email_template_id: '{{#? EMAILTEMPLATEID}}',
    email_from: '{{#? EMAILFROM}}',
    email_to: '{{#? EMAILTO}}',
    mail_supplier: '{{#? MAILSUPPLIER}}',
    send_time: '{{#? SENDTIME}}',
    status: '{{ STATUS ? STATUS : 0 }}',
    type: '{{#? TYPE}}',
    note: '{{#? NOTE}}',
    subject: '{{#? SUBJECT}}',
    email_content: '{{#? EMAILCONTENT}}',
    schedule_time: '{{#? SCHEDULETIME}}',
    is_open: '{{ ISOPEN ? 1 : 0}}',
    is_clicked: '{{ISCLICKED ? 1 : 0}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'email_history_id',
        'status',
        'email_from',
        'email_to',
        'email_template_id',
        'mail_supplier',
        'send_time',
        'note',
        'email_content',
        'schedule_time',
        'is_open',
        'is_clicked',
        'subject',
        'type',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'email_history_id',
        'status',
        'email_from',
        'email_to',
        'email_template_id',
        'mail_supplier',
        'send_time',
        'subject',
        'note',
        'email_content',
        'type',
        'schedule_time',
        'is_open',
        'is_clicked',
        'created_date',
        'created_user',
    ]);
};

const statistics = (obj) => {
    const template = {
        total_count: '{{ TOITALCOUNT ? TOITALCOUNT : 0 }}',
        total_success: '{{ TOTALSUCCESS ? TOTALSUCCESS : 0}}',
        total_fail: '{{ TOTALFAIL ? TOTALFAIL : 0}}',
        total_schedule: '{{ TOTALSCHEDULE ? TOTALSCHEDULE : 0}}',
        total_processing: '{{ TOTALPROCESSING ? TOTALPROCESSING : 0}}',
    };

    const transform = new Transform(template);

    return transform.transform(obj, [
        'total_count',
        'total_success',
        'total_fail',
        'total_schedule',
        'total_processing',
    ]);
};

module.exports = {
    detail,
    list,
    statistics,
};
