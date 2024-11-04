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
    customer_name: '{{#? CUSTOMERNAME}}',
    total_customer: '{{#? TOTALCUSTOMER}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    address: '{{#? ADDRESS}}',

    task_detail_id: '{{#? TASKDETAILID}}',

    workflow_id: '{{#? TASKWORKFLOWID}}',
    workflow_name: '{{#? WORKFLOWNAME}}',

    comment_id: '{{#? COMMENTID}}',
    comment_content: '{{#? COMMENTCONTENT}}',

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
    campaign_name: '{{#? CAMPAIGNNAME}}',
    list_name: '{{#? LISTNAME}}',
    sender_name: '{{#? SENDERNAME}}',
    sender_email: '{{#? SENDEREMAIL}}',
    status: '{{#? STATUS}}',
    // SMS
    content_sms: '{{#? CONTENTSMS}}',
    customer_id: '{{#? CUSTOMERID}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    total_customer: '{{#? TOTALCUSTOMER}}',
    total_customer_complete: '{{#? TOTALCUSTOMERCOMPLETE}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    address: '{{#? ADDRESS}}',
    type_purchase: '{{#? TYPE_PURCHASE}}',
    total_task: '{{#? TOTATLTASK}}',
    total_task_complete: '{{#? TOTATLTASKCOMPLETE}}',

    workflow_id: '{{#? TASKWORKFLOWID}}',
    workflow_name: '{{#? WORKFLOWNAME}}',
};

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
        'total_customer',
        'customer_type_name',
        'phone_number',
        'gender',
        'address',
        'email',
        'birthday',
        'hobbies',
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
    ]);
};

const workflowList = (list = []) => {
    return transform.transform(list, ['workflow_id', 'workflow_name']);
};

const careCommentList = (list = []) => {
    return transform.transform(list, ['comment_id', 'content_comment', 'created_date', 'created_user']);
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
        'campaign_name',
        'list_name',
        'sender_name',
        'sender_email',
        'status',
        'comment_id',
        'created_date',
        'created_user',
    ]);
};

const careProductList = (list = []) => {
    return transform.transform(list, ['product_id', 'product_name', 'comment_id', 'picture_url']);
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
    ]);
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
    careCommentList,
    careHistoryList,
    careProductList,
    listCustomer,
    taskTypeOption,
};
