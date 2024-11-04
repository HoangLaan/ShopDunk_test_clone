import React from 'react';
import { PERMISSION } from 'pages/Customer/utils/constants';

const CustomerPage = React.lazy(() => import('pages/Customer/pages/CustomerPage'));
const CustomerAddPage = React.lazy(() => import('pages/Customer/pages/CustomerAddPage'));

const customerRoute = [
  {
    path: '/customer',
    exact: true,
    name: 'Danh sách khách hàng cá nhân',
    function: PERMISSION.VIEW,
    component: CustomerPage,
  },
  {
    path: '/customer/add',
    exact: true,
    name: 'Thêm mới khách hàng cá nhân',
    function: PERMISSION.ADD,
    component: CustomerAddPage,
  },
  {
    path: '/customer/edit/:account_id',
    exact: true,
    name: 'Chỉnh sửa khách hàng cá nhân',
    function: PERMISSION.EDIT,
    component: CustomerAddPage,
  },
  {
    path: '/customer/detail/:account_id',
    exact: true,
    name: 'Chi tiết khách hàng cá nhân',
    function: PERMISSION.VIEW,
    component: CustomerAddPage,
  },
];

export default customerRoute;
