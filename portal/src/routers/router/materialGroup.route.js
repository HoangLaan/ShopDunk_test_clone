import React from 'react';

const MaterialGroupPage = React.lazy(() => import('pages/MaterialGroup/pages/MaterialGroupPage'));
const MaterialGroupAdd = React.lazy(() => import('pages/MaterialGroup/pages/MaterialGroupAdd'));
const MaterialGroupDetail = React.lazy(() => import('pages/MaterialGroup/pages/MaterialGroupDetail'));
const MaterialGroupEdit = React.lazy(() => import('pages/MaterialGroup/pages/MaterialGroupEdit'));

const MaterialGroupRoutes = [
  {
    path: '/material-group',
    exact: true,
    name: 'Danh sách nhóm nguyên liệu',
    function: 'MTR_MATERIALGROUP_VIEW',
    component: MaterialGroupPage,
  },
  {
    path: '/material-group/add',
    exact: true,
    name: 'Thêm mới',
    function: 'MTR_MATERIALGROUP_ADD',
    component: MaterialGroupAdd,
  },
  {
    path: '/material-group/detail/:id',
    exact: true,
    name: 'Chi tiết',
    function: 'MTR_MATERIALGROUP_VIEW',
    component: MaterialGroupDetail,
  },
  {
    path: '/material-group/edit/:id',
    exact: true,
    name: 'Chỉnh sửa',
    function: 'MTR_MATERIALGROUP_EDIT',
    component: MaterialGroupEdit,
  },
];

export default MaterialGroupRoutes;
