import React from 'react';
import { PERMISSION } from 'pages/TaskType/utils/constants';

const TaskType = React.lazy(() => import('pages/TaskType/pages/TaskType'));
const TaskTypeAdd = React.lazy(() => import('pages/TaskType/pages/TaskTypeAdd'));

const taskTypeRoute = [
  {
    path: '/task-type',
    exact: true,
    name: 'Danh sách loại công việc',
    function: PERMISSION.VIEW,
    component: TaskType,
  },
  {
    path: '/task-type/add',
    exact: true,
    name: 'Thêm mới loại công việc',
    function: PERMISSION.ADD,
    component: TaskTypeAdd,
  },
  {
    path: '/task-type/edit/:task_type_id',
    exact: true,
    name: 'Chỉnh sửa loại công việc',
    function: PERMISSION.EDIT,
    component: TaskTypeAdd,
  },
  {
    path: '/task-type/detail/:task_type_id',
    exact: true,
    name: 'Chi tiết loại công việc',
    function: PERMISSION.VIEW,
    component: TaskTypeAdd,
  },
];

export default taskTypeRoute;
