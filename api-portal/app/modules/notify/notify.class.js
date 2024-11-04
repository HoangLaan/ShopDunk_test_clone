const Transform = require('../../common/helpers/transform.helper');

const template = {
    notify_id: '{{#? NOTIFYID}}',
    notify_user_id: '{{#? NOTIFYUSERID}}',
    notify_content: '{{#? NOTIFYCONTENT}}',
    receive_date: '{{#? RECEIVEDATE}}',
    notify_title: '{{#? NOTIFYTITLE}}',
    total_items: '{{#? TOTALITEMS}}',
    is_read: '{{#? ISREAD}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    task_detail_id: '{{#? TASKDETAILID}}',
    order_id: '{{#? ORDERID}}'
};

let transform = new Transform(template);

const listNotify = (data = []) => {
    return transform.transform(data, [
        'notify_id',
        'notify_user_id',
        'notify_content',
        'receive_date',
        'notify_title',
        'total_items',
        'is_read',
        'task_work_flow_id',
        'task_detail_id',
        'order_id'
    ]);
};

module.exports = {
    listNotify,
};
