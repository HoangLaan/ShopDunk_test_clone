const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID }}',
    type_name: '{{#? TYPENAME }}',
    is_filter_once: '{{ ISFILTERONCE ? 1: 0 }}',
    is_filter_daily: '{{ ISFILTERDAILY ? 1 : 0 }}',
    is_filter_monthly: '{{ ISFILTERMONTHLY ? 1 : 0 }}',
    time_value: '{{#? TIMEVALUE }}',
    time_value_daily: '{{#? TIMEVALUEDAILY }}',
    time_value_monthly: '{{#? TIMEVALUEMONTHLY }}',
    time_value_once: '{{#? TIMEVALUEONCE }}',
    date_value: '{{#? DATEVALUE }}',
    description: '{{#? DESCRIPTION }}',
    created_date: '{{#? CREATEDDATEVIEW }}',
    is_active: '{{ ISACTIVE? 1: 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listTaskType = (data = []) => {
  const _template = {
    task_work_follow_id: '{{#? task_work_follow_id }}',
    task_work_follow_name: '{{#? task_work_follow_name }}',
    is_active: '{{#? is_active }}',
    order_index: '{{#? order_index }}',
    is_complete: '{{#? is_complete }}',
    create_date: '{{#? create_date }}',
    description: '{{#? description }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listTaskWorkflow = (data = []) => {
  const _template = {
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    work_flow_name: '{{#? WORKFLOWNAME}}',
    description: '{{#? DESCRIPTION}}',
    type_purchase: '{{#? TYPEPURCHASE ? 1 : 0 }}',
    is_refuse: '{{#? ISREFUSE ? 1 : 0 }}',
    is_complete: '{{ ISCOMPLETE ? 1 : 0 }}',
    is_active: '{{ ISACTIVE ? 1 : 0 }}',
    type_repeat: '{{#? TYPEREPEAT ? 1 : 0 }}',
    minimum_time: '{{#? MINIMUMTIME }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listCondition = (data = []) => {
  const _template = {
    condition_id: '{{#? CONDITIONID}}',
    condition_name: '{{#? CONDITIONNAME}}',
    is_database: '{{ ISDATABASE ? 1 : 0 }}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    condition_value_list: '{{#? CONDITIONVALUELIST.split("|")}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listUser = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID}}',
    user_name: '{{#? USERNAME }}',
    value_ratio: '{{#? VALUERATIO }}',
    full_name: '{{#? FULLNAME}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listModel = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID}}',
    model_id: '{{#? MODELID}}',
    id: '{{#? MODELID}}',
    value: '{{#? MODELID}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const wflowSendEmail = (data = []) => {
  const _template = {
    task_type_wflow_email_id: '{{#? TASKTYPEWFLOWEMAILID}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    task_type_id: '{{#? TASKTYPEID}}',
    mail_supplier_id: '{{#? MAILSUPPLIERID}}',
    mail_from: '{{#? MAILFROM}}',
    mail_subject: '{{#? MAILSUBJECT}}',
    mail_from_name: '{{#? MAILFROMNAME}}',
    mail_reply: '{{#? MAILREPLY}}',
    email_template_id: '{{#? EMAILTEMPLATEID}}',
    send_schedule_time: '{{#? SENDSCHEDULETIME}}',
    send_schedule_after_days: '{{#? SENDSCHEDULEAFTERDAYS}}',
    is_send_email: 1,
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const wflowSendSMS = (data = []) => {
  const _template = {
    task_type_wflow_sms_id: '{{#? TASKTYPEWFLOWSMSID}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    task_type_id: '{{#? TASKTYPEID}}',
    brandname: '{{#? BRANDNAME}}',
    sms_template_id: '{{#? SMSTEMPLATEID}}',
    content_sms: '{{#? CONTENTSMS}}',
    send_schedule_time: '{{#? SENDSCHEDULETIME}}',
    send_schedule_after_days: '{{#? SENDSCHEDULEAFTERDAYS}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const wflowSendZalo = (data = []) => {
  const _template = {
    task_type_wflow_zalo_id: '{{#? TASKTYPEWFLOWZALOID}}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    task_type_id: '{{#? TASKTYPEID}}',
    zalo_template_content: '{{#? ZALOTEMPLATECONTENT}}',
    send_schedule_time: '{{#? SENDSCHEDULETIME}}',
    send_schedule_after_days: '{{#? SENDSCHEDULEAFTERDAYS}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};


const getById = (data = {}) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID }}',
    type_name: '{{#? TYPENAME }}',
    object_type: '{{#? OBJECTTYPE }}',
    customer_type_id: '{{#? CUSTOMERTYPEID }}',
    description: '{{#? DESCRIPTION }}',
    add_function_id: '{{#? ADDFUNCTIONID }}',
    edit_function_id: '{{#? EDITFUNCTIONID }}',
    edit_all_function_id: '{{#? EDITALLFUNCTIONID }}',
    delete_function_id: '{{#? DELETEFUNCTIONID }}',
    delete_all_function_id: '{{#? DELETEALLFUNCTIONID }}',
    is_birthday: '{{ ISBIRTHDAY ? 1 : 0 }}',
    is_wedding_anniversary: '{{ ISWEDDINGANNIVERSARY ? 1 : 0 }}',
    is_time_not_buying: '{{ ISTIMENOTBUYING ? 1 : 0 }}',
    value_time_not_buying: '{{#? VALUETIMENOTBUYING }}',
    is_final_buy: '{{ ISFINALBUY ? 1 : 0 }}',
    time_final_buy_from: '{{#? TIMEFINALBUYFROM }}',
    is_filter_once: '{{ ISFILTERONCE ? 1: 0 }}',
    is_filter_daily: '{{ ISFILTERDAILY ? 1 : 0 }}',
    is_filter_monthly: '{{ ISFILTERMONTHLY ? 1 : 0 }}',
    time_value: '{{#? TIMEVALUE }}',
    time_value_daily: '{{#? TIMEVALUEDAILY }}',
    time_value_monthly: '{{#? TIMEVALUEMONTHLY }}',
    time_value_once: '{{#? TIMEVALUEONCE }}',
    date_value: '{{#? DATEVALUE }}',
    receiver_id: '{{#? RECEIVERID }}',
    is_birthday_relatives: '{{ ISBIRTHDAYRELATIVES ? 1 : 0 }}',
    is_number_of_buying: '{{ ISNUMBEROFBUYING ? 1 : 0 }}',
    value_number_of_buying_from: '{{#? VALUENUMBEROFBUYINGFROM }}',
    type_time_not_buying: '{{#? TYPETIMENOTBUYING }}',
    is_after_the_last_care: '{{ ISAFTERTHELASTCARE ? 1 : 0 }}',
    value_after_the_last_care: '{{#? VALUEAFTERTHELASTCARE }}',
    type_after_the_last_care: '{{#? TYPEAFTERTHELASTCARE }}',
    is_total_money_spending: '{{ ISTOTALMONEYSPENDING ? 1 : 0 }}',
    value_number_of_buying_to: '{{#? VALUENUMBEROFBUYINGTO }}',
    value_total_money_spending_from: '{{#? VALUETOTALMONEYSPENDINGFROM }}',
    value_total_money_spending_to: '{{#? VALUETOTALMONEYSPENDINGTO }}',
    is_total_current_point: '{{ ISTOTALCURRENTPOINT ? 1 : 0 }}',
    value_total_current_point_from: '{{#? VALUETOTALCURRENTPOINTFROM }}',
    value_total_current_point_to: '{{#? VALUETOTALCURRENTPOINTTO }}',
    is_after_upgrade: '{{ ISAFTERUPGRADE ? 1 : 0 }}',
    value_date_after_upgrade: '{{#? VALUEDATEAFTERUPGRADE }}',
    is_current_workflow: '{{ ISCURRENTWORKFLOW ? 1 : 0 }}',
    task_workflow_id: '{{#? TASKWORKFLOWID }}',
    is_product_hobbies: '{{ ISPRODUCTHOBBIES ? 1 : 0 }}',
    model_id: '{{#? MODELID }}',
    is_task_type_auto: '{{ ISTASKTYPEAUTO ? 1 : 0 }}',
    time_final_buy_to: '{{#? TIMEFINALBUYTO }}',
    is_equal_divide: '{{ ISEQUALDIVIDE ? 1 : 0 }}',
    is_ratio_divide: '{{ ISRATIODIVIDE ? 1 : 0 }}',
    is_get_data: '{{ ISGETDATA ? 1 : 0 }}',
    is_divide: '{{#? ISDIVDIDE }}',

    is_active: '{{ ISACTIVE ? 1 : 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getListCondition = (data = []) => {
  const _template = {
    condition_id: '{{#? CONDITIONID }}',
    condition_name: '{{#? CONDITIONNAME }}',
    is_database: '{{ ISDATABASE ? 1 : 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  list,
  listTaskType,
  getById,
  listTaskWorkflow,
  listUser,
  listModel,
  getListCondition,
  listCondition,
  wflowSendEmail,
  wflowSendSMS,
  wflowSendZalo,
};
