import React from 'react';

// Users
const Users = React.lazy(() => import('pages/User/User'));
const UserAdd = React.lazy(() => import('pages/User/UserAdd'));
//.end#Users

const userRoutes = [
  // Users
  {
    path: '/users',
    exact: true,
    name: 'Danh sách nhân viên',
    function: 'SYS_USER_VIEW',
    component: Users,
  },
  {
    path: '/users/add',
    exact: true,
    name: 'Thêm mới nhân viên',
    function: 'SYS_USER_ADD',
    component: UserAdd,
  },
  {
    path: '/users/detail/:id',
    exact: true,
    name: 'Chi tiết nhân viên',
    function: 'SYS_USER_VIEW',
    component: UserAdd,
  },
  {
    path: '/users/edit/:id',
    exact: true,
    name: 'Chỉnh sửa nhân viên',
    function: 'SYS_USER_EDIT',
    component: UserAdd,
  },
  //.end#Users
];

export default userRoutes;
