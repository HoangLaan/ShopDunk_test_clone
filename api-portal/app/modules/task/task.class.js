const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    task_id: '{{#? TASKID}}',
    task_name: '{{#? TASKNAME}}',
    task_type_id: '{{#? TASKTYPEID}}',
    parent_id: '{{#? PARENTID}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    description: '{{#? DESCRIPTION}}',

    company_id: '{{#? COMPANYID}}',
    department_id: '{{#? DEPARTMENTID}}',
    store_id: '{{#? STOREID}}',
    supervisor_user: '{{#? SUPERVISORNAME}}',
    supervisor_name: '{{#? SUPERVISORNAMETEXT}}',
    staff_user: '{{#? USERNAME}}',
    staff_name: '{{#? USERNAMETEXT}}',

    is_complete: '{{ISCOMPLETED ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',

    company_name: '{{#? COMPANYNAME}}',
    task_type_name: '{{#? TASKTYPENAME}}',
    working_form_name: '{{#? WORKINGFORMNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',

    member_id: '{{#? MEMBERID}}',
    data_leads_id: '{{#? DATALEADSID}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    full_name: '{{#? FULLNAME}}',
    gender: '{{GENDER ? 1 : 0}}',
    birthday: '{{#? BIRTHDAY}}',
    hobbies: '{{#? HOBBIES}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',

    avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    customer_id: '{{#? CUSTOMERID}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    total_customer: '{{#? TOTALCUSTOMER}}',
    total_customer_complete: '{{#? TOTALCUSTOMERCOMPLETE}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    address: '{{#? ADDRESS}}',
    zalo_id: '{{#? ZALOID}}',
    type_purchase: '{{#? TYPEPURCHASE ? 1 : 0 }}',
    total_task: '{{#? TOTATLTASK}}',
    total_task_complete: '{{#? TOTATLTASKCOMPLETE}}',

    task_detail_id: '{{#? TASKDETAILID}}',
    store_name: '{{#? STORENAME}}',
    order_no: '{{#? ORDERNO}}',

    workflow_id: '{{#? TASKWORKFLOWID}}',
    workflow_name: '{{#? WORKFLOWNAME}}',

    comment_id: '{{#? COMMENTID}}',
    comment_content: '{{#? COMMENTCONTENT}}',
    content_comment: '{{#? CONTENTCOMMENT}}',

    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',

    tab: '{{#? TAB}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    task_workflow_name: '{{#? TASKWORKFLOWNAME}}',
    task_workflow_old_name: '{{#? TASKWORKFLOWOLDNAME}}',
    content_sms: '{{#? CONTENTSMS}}',
    call_type: '{{#? CALLTYPE}}',
    subject: '{{#? SUBJECT}}',
    event_start_date_time: '{{#? EVENTSTARTDATETIME}}',
    event_end_date_time: '{{#? EVENTENDDATETIME}}',
    duration: '{{#? DURATION}}',
    content_meeting: '{{#? CONTENTMEETING}}',
    location: '{{#? LOCATION}}',
    email_history_id: '{{#? EMAILHISTORYID}}',
    campaign_name: '{{#? CAMPAIGNNAME}}',
    list_name: '{{#? LISTNAME}}',
    sender_name: '{{#? SENDERNAME}}',
    sender_email: '{{#? SENDEREMAIL}}',
    status: '{{#? STATUS}}',
    // SMS
    sip_id: '{{#? SIPID}}',

    file_record: '{{#? FILERECORD}}',
    cause_voip: '{{#? CAUSEVOIP}}',
    time_started: '{{#? TIMESTARTED}}',
    time_answered: '{{#? TIMEANSWERED}}',
    time_ended: '{{#? TIMEENDED}}',
    time_ringging: '{{#? TIMERINGGING}}',
    app: '{{#? APP}}',
    rate: '{{#? RATE}}',

    is_workflow_completed: '{{ISWORKFLOWCOMPLETED ? 1 : 0}}',
    user_id: '{{#? USERID }}',
    supervisor_user_id: '{{#? SUPERVISORUSERID }}',

    content_comment: '{{#? CONTENTCOMMENT }}',
    is_called: '{{ ISCALLED ? 1: 0 }}',
    interest_content: '{{#? INTERESTCONTENT? INTERESTCONTENT.split("|"): [] }}',
};


const imageTemplate = {
    picture_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        }
    ],
    comment_id: '{{#? COMMENTID}}',
}

let transformImages = new Transform(imageTemplate);

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'task_id',
        'task_name',
        'task_type_id',
        'parent_id',
        'start_date',
        'end_date',
        'description',

        'company_id',
        'department_id',
        'store_id',
        'supervisor_user',
        'supervisor_name',
        'staff_user',
        'staff_name',

        'is_active',
        'is_system',
    ]);
};

const attachmentDetail = (obj) => {
    return transform.transform(obj, ['attachment_name', 'attachment_path']);
};

const list = (list = []) => {
    return transform.transform(list, [
        'task_id',
        'task_no',
        'task_name',
        'company_name',
        'task_type_name',
        'working_form_name',
        'supervisor_name',
        'total_customer_complete',
        'total_customer',
        'staff_name',
        'start_date',
        'end_date',
        'created_user',
        'created_date',
        'is_active',
        'is_complete',
        'total_task_complete',
        'total_task',
    ]);
};

const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    parent_id: '{{#? PARENTID}}',
};

const options = (options = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(options, ['id', 'name', 'parent_id']);
};

const memberList = (list = []) => {
    return transform.transform(list, [
        'member_id',
        'data_leads_id',
        'customer_code',
        'full_name',
        'gender',
        'birthday',
        'phone_number',
        'email',
        'is_active',
        'created_date',
    ]);
};

const customerInformation = (obj) => {
    return transform.transform(obj, [
        'member_id',
        'data_leads_id',
        'avatar',
        'customer_name',
        'full_name',
        'total_customer',
        'customer_type_name',
        'phone_number',
        'gender',
        'address',
        'email',
        'birthday',
        'hobbies',
        'zalo_id',
        'interest_content',
    ]);
};
const taskInformation = (obj) => {
    return transform.transform(obj, [
        'task_detail_id',
        'task_type_name',
        'task_name',
        'start_date',
        'end_date',
        'staff_name',
        'supervisor_name',
        'user_id',
        'supervisor_user_id',
    ]);
};

const workflowList = (list = []) => {
    return transform.transform(list, [
        'workflow_id',
        'workflow_name',
        'type_purchase'
    ]);
};

// const listCustomer = (list = []) => {
//     return transform.transform(list, [
//         'customer_id',
//         'full_name',
//         'customer_code',
//         'gender',
//         'birthday',
//         'phone_number',
//         'email',
//         'address',
//         'type_purchase',
//     ]);
// };

const careCommentList = (list = []) => {
    return transform.transform(list, ['comment_id', 'content_comment', 'created_date', 'created_user', 'picture_url']);
};

const careHistoryList = (list = []) => {
    return transform.transform(list, [
        'tab',
        'task_workflow_name',
        'task_workflow_old_name',
        'content_sms',
        'call_type',
        'subject',
        'description',
        'event_start_date_time',
        'event_end_date_time',
        'duration',
        'content_meeting',
        'location',
        'email_history_id',
        'campaign_name',
        'list_name',
        'sender_name',
        'sender_email',
        'status',
        'comment_id',
        'created_date',
        'created_user',
        'file_record',
        'cause_voip',
        'time_started',
        'time_answered',
        'time_ended',
        'time_ringging',
        'app',
        'rate',
        'picture_url'
    ]);
};

const careProductList = (list = []) => {
    return transform.transform(list, ['product_id', 'product_name', 'comment_id', 'picture_url']);
};

const careProductHistory = (list = []) => {
    return transform.transform(list, 
        [
        'created_date',
        'product_id', 
        'product_name', 
        'comment_id',
    ]);
};

const imagesList = (list = []) => {
    return transformImages.transform(list, ['picture_url', 'comment_id']);
};

const listCustomer = (list = []) => {
    return transform.transform(list, [
        'task_detail_id',
        'customer_id',
        'full_name',
        'customer_code',
        'gender',
        'birthday',
        'phone_number',
        'email',
        'address',
        'type_purchase',
        'workflow_name',
        'is_workflow_completed',
        'zalo_id',
        'is_called',
        'store_name',
        'order_no',
    ]);
};

const listCustomerByUser = (list = []) => {
    return transform.transform(list, [
        'task_detail_id',
        'task_name',
        'customer_id',
        'full_name',
        'customer_code',
        'gender',
        'birthday',
        'phone_number',
        'email',
        'address',
        'type_purchase',
        'workflow_name',
        'is_workflow_completed',
        'zalo_id',
        'is_called',
    ]);
};

const brandnameOptions = (list = []) => {
    const transform = new Transform({
        id: '{{#? Brandname}}',
        name: '{{#? Brandname}}',
    });

    return transform.transform(list, ['id', 'name']);
};

const smsTemplateOptions = (list = []) => {
    const transform = new Transform({
        id: '{{#? TempId}}',
        name: '{{#? TempContent}}',
    });

    return transform.transform(list, ['id', 'name']);
};

const taskTypeOption = (data = []) => {
    const _template = {
        id: '{{#? TASKTYPEID }}',
        name: '{{#? TYPENAME }}',
        parent_id: '{{ 0 }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    detail,
    attachmentDetail,
    list,
    options,
    memberList,
    customerInformation,
    taskInformation,
    workflowList,
    careHistoryList,
    careProductList,
    careCommentList,
    listCustomer,
    listCustomerByUser,
    brandnameOptions,
    smsTemplateOptions,
    taskTypeOption,
    imagesList,
    careProductHistory
};
