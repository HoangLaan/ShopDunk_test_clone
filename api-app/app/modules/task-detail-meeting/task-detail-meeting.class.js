const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    // Task detail
    task_detail_id: '{{#? TASKDETAILID}}',
    created_date: '{{#? CREATEDDATE}}',

    // Account
    full_name: '{{#? FULLNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    image_avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],

    // Meeting
    data_leads_meeting_id: '{{#? DATALEADSMEETINGID}}',
    event_start_date_time: '{{#? EVENTSTARTDATETIME}}',
    event_end_date_time: '{{#? EVENTENDDATETIME}}',
    content_meeting: '{{#? CONTENTMEETING}}',
    is_coming: '{{ISCOMING ? 1 : 0}}',

    // TaskWorkFlow
    work_flow_name: '{{#? WORKFLOWNAME}}',
    work_flow_code: '{{#? WORKFLOWCODE}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',

    // User
    user_name: '{{#? USERNAME}}',

    // TaskType
    type_name: '{{#? TYPENAME}}',

    // Task
    task_id: '{{#? TASKID}}',

    // Product
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    image_url: '{{#? IMAGEURL}}',
    product_list: '{{#? PRODUCTLIST}}',

    // FavoriteProduct
    model_id: '{{#? MODELID}}',
    comment_id: '{{#? COMMENTID}}',
};

const transform = new Transform(template);

const detail = obj => {
    return transform.transform(obj, [
        'data_leads_meeting_id',
        'full_name',
        'phone_number',
        'image_avatar',
        'event_start_date_time',
        'event_end_date_time',
        'user_name',
        'work_flow_name',
        'work_flow_code',
        'task_work_flow_id',
        'type_name',
        'content_meeting',
        'task_detail_id',
        'is_coming',
        'product_list',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'data_leads_meeting_id',
        'full_name',
        'phone_number',
        'image_avatar',
        'event_start_date_time',
        'event_end_date_time',
        'work_flow_code',
        'is_coming',
    ]);
};

const deleteFavorite = (list = []) => {
    return transform.transform(list, ['comment_id']);
};

const taskWorkFlow = (list = []) => {
    return transform.transform(list, ['task_work_flow_id', 'work_flow_name', 'work_flow_code']);
};

const productOptions = (list = []) => {
    return transform.transform(list, ['product_id', 'product_name', 'product_code', 'image_url']);
};

module.exports = {
    detail,
    list,
    taskWorkFlow,
    deleteFavorite,
    productOptions,
};
