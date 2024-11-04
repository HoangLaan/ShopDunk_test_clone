import React from 'react';
import { TASK_PERMISSION } from 'pages/Task/utils/const';

const TaskPage = React.lazy(() => import('pages/Task/TaskPage'));
const CustomerPage = React.lazy(() => import('pages/Task/CustomerPage'));
const CustomerByUserPage = React.lazy(() => import('pages/Task/CustomerByUserPage'));
const TaskAddPage = React.lazy(() => import('pages/Task/TaskAddPage'));
const TaskDetailPage = React.lazy(() => import('pages/Task/TaskDetailPage'));

const taskRoute = [
  {
    path: '/task',
    exact: true,
    name: 'Danh sách công việc ',
    function: TASK_PERMISSION.VIEW,
    component: TaskPage,
  },
  {
    path: '/task/customer/:task_id',
    exact: true,
    name: 'Danh sách khách hàng thuộc công việc',
    function: TASK_PERMISSION.VIEW,
    component: CustomerPage,
  },
  {
    path: '/task/customer',
    exact: true,
    name: 'Danh sách công việc',
    function: TASK_PERMISSION.VIEW,
    component: CustomerByUserPage,
  },
  {
    path: '/task/add',
    exact: true,
    name: 'Thêm mới công việc',
    function: TASK_PERMISSION.ADD,
    component: TaskAddPage,
  },
  {
    path: '/task/detail/:task_detail_id',
    exact: true,
    name: 'Chi tiết công việc',
    function: TASK_PERMISSION.VIEW,
    component: TaskDetailPage,
  },
  {
    path: '/task/edit/:task_id',
    exact: true,
    name: 'Chỉnh sửa công việc',
    function: TASK_PERMISSION.EDIT,
    component: TaskAddPage,
  },
];

export default taskRoute;
