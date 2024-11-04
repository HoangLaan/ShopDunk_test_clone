import React from 'react';

const MenusAddPage = React.lazy(() => import('pages/Menus/MenusAddPage'));
const MenusPage = React.lazy(() => import('pages/Menus/MenusPage'));

const menu = [
  {
    path: '/menus',
    exact: true,
    name: 'Danh sách menu',
    function: 'SYS_MENU_VIEW',
    component: MenusPage,
  },
  {
    path: '/menus/add',
    exact: true,
    name: 'Thêm mới menu',
    function: 'SYS_MENU_ADD',
    component: MenusAddPage,
  },
  {
    path: '/menus/edit/:menu_id',
    exact: true,
    name: 'Chỉnh sửa menu',
    function: 'SYS_MENU_EDIT',
    component: MenusAddPage,
  },
  {
    path: '/menus/detail/:menu_id',
    exact: true,
    name: 'Chi tiết menu',
    function: 'SYS_MENU_VIEW',
    component: MenusAddPage,
  },
];

export default menu;
