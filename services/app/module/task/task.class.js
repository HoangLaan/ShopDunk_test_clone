const Transform = require('../../common/helpers/transform.helper');
const template = {
  notify_id: '{{#? NOTIFYID}}',
  notify_title: '{{#? NOTIFYTITLE}}',
  notify_content: '{{#? NOTIFYCONTENT}}',

  task_type_work_flow_id: '{{#? TASKTYPEWORKFLOWID}}',
  order_index: '{{#? ORDERINDEX}}',
  task_type_id: '{{#? TASKTYPEID}}',
  minimu_time: '{{#? MINIMUMTIME}}',
  task_work_flow_id: '{{#? TASKWORKFLOWID}}',
  work_flow_name: '{{#? WORKFLOWNAME}}',
  task_detail_id: '{{#? TASKDETAILID}}',
};

let transform = new Transform(template);

const notify = (notify) => {
  return transform.transform(notify, ['notify_id', 'notify_title', 'notify_content']);
};

const getChangeWFlow = (data) => {
  return transform.transform(data, [
    'task_type_work_flow_id',
    'order_index',
    'task_type_id',
    'minimu_time',
    'task_work_flow_id',
    'work_flow_name',
    'task_detail_id',
  ]);
};

module.exports = {
  notify,
  getChangeWFlow,
};
