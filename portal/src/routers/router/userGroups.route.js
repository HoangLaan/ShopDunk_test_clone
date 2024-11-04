import React from 'react';

// UserGroups
const UserGroups = React.lazy(() => import('pages/UserGroup/UserGroup'));
const UserGroupsAdd = React.lazy(() => import('pages/UserGroup/UserGroupAdd'));
const UserGroupsEdit = React.lazy(() => import('pages/UserGroup/UserGroupEdit'));
const UserGroupsDetail = React.lazy(() => import('pages/UserGroup/UserGroupDetail'));
//.end#UsersGroups

const UserGroupsRoutes = [
  //UserGroup
  {
    path: '/user-group',
    exact: true,
    name: 'Danh sách nhóm người dùng',
    function: 'SYS_USERGROUP_VIEW',
    component: UserGroups,
  },
  {
    path: '/user-group/add',
    exact: true,
    name: 'Thêm mới nhóm người dùng',
    function: 'SYS_USERGROUP_ADD',
    component: UserGroupsAdd,
  },
  {
    path: '/user-group/detail/:id',
    exact: true,
    name: 'Chi tiết nhóm người dùng',
    function: 'SYS_USERGROUP_VIEW',
    component: UserGroupsDetail,
  },
  {
    path: '/user-group/delete/:id',
    exact: true,
    name: 'Xóa',
    function: 'SYS_USERGROUP_DEL',
  },
  {
    path: '/user-group/edit/:id',
    exact: true,
    name: 'Chỉnh sửa nhóm người dùng',
    function: 'SYS_USERGROUP_EDIT',
    component: UserGroupsEdit,
  },
  //.end#UserGroup
];

export default UserGroupsRoutes;
