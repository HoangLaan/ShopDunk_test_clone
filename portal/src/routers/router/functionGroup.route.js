import React from 'react';

const FunctionGroupPage = React.lazy(() => import('pages/FunctionGroup/FunctionGroupPage'));
const FunctionGroupAddPage = React.lazy(() => import('pages/FunctionGroup/FunctionGroupAddPage'));

const functionGroup = [
  {
    path: '/function-groups',
    exact: true,
    name: 'Danh sách nhóm quyền',
    function: 'SYS_FUNCTIONGROUP_VIEW',
    component: FunctionGroupPage,
  },
  {
    path: '/function-groups/add',
    exact: true,
    name: 'Thêm nhóm quyền',
    function: 'SYS_FUNCTIONGROUP_ADD',
    component: FunctionGroupAddPage,
  },
  {
    path: '/function-groups/edit/:function_group_id',
    exact: true,
    name: 'Chỉnh sửa nhóm quyền',
    function: 'SYS_FUNCTIONGROUP_EDIT',
    component: FunctionGroupAddPage,
  },
  {
    path: '/function-groups/detail/:function_group_id',
    exact: true,
    name: 'Chi tiết nhóm quyền',
    function: 'SYS_FUNCTIONGROUP_VIEW',
    component: FunctionGroupAddPage,
  },
];

export default functionGroup;
