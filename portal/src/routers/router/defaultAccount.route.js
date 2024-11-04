import React from 'react';

const DefaultAccountAddPage = React.lazy(() => import('pages/DefaultAccount/DefaultAccountAddPage'));
const DefaultAccountPage = React.lazy(() => import('pages/DefaultAccount/DefaultAccountPage'));

const prefix = '/default-account';
const defaultAccount = [
  {
    path: prefix,
    exact: true,
    name: 'Danh sách tài khoản ngầm định',
    function: 'AC_DEFAULTACCOUNT_VIEW',
    component: DefaultAccountPage,
  },
  {
    path: `${prefix}/add`,
    exact: true,
    name: 'Thêm mới tài khoản ngầm định',
    function: 'AC_DEFAULTACCOUNT_ADD',
    component: DefaultAccountAddPage,
  },
  {
    path: `${prefix}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa tài khoản ngầm định',
    function: 'AC_DEFAULTACCOUNT_EDIT',
    component: DefaultAccountAddPage,
  },
  {
    path: `${prefix}/detail/:id`,
    exact: true,
    name: 'Chi tiết tài khoản ngầm định',
    function: 'AC_DEFAULTACCOUNT_VIEW',
    component: DefaultAccountAddPage,
  },
];

export default defaultAccount;
