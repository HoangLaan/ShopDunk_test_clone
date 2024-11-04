import React from 'react';

const TaskWorkFlowAddPage = React.lazy(() => import('pages/TaskWorkFlow/TaskWorkFlowAddPage'));
const TaskWorkFlowPage = React.lazy(() => import('pages/TaskWorkFlow/TaskWorkFlowPage'));

const TaskWorkFlow = [
  {
    path: '/task-work-flow',
    exact: true,
    name: 'Danh sách bước xử lý công việc',
    function: 'CRM_TASKWORKFLOW_VIEW',
    component: TaskWorkFlowPage,
  },
  {
    path: '/task-work-flow/add',
    exact: true,
    name: 'Thêm bước xử lý công việc',
    function: 'CRM_TASKWORKFLOW_ADD',
    component: TaskWorkFlowAddPage,
  },
  {
    path: '/task-work-flow/edit/:id',
    exact: true,
    name: 'Chỉnh sửa bước xử lý công việc',
    function: 'CRM_TASKWORKFLOW_EDIT',
    component: TaskWorkFlowAddPage,
  },
  {
    path: '/task-work-flow/detail/:id',
    exact: true,
    name: 'Chi tiết bước xử lý công việc',
    function: 'CRM_TASKWORKFLOW_VIEW',
    component: TaskWorkFlowAddPage,
  },
];

export default TaskWorkFlow;
