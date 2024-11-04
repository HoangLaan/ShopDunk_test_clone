import React from 'react';
import { PERMISSION } from 'pages/CustomerWorking/utils/constants';

const CustomerWorking = React.lazy(() => import('pages/CustomerWorking/pages/CustomerWorking'));
const CustomerWorkingAdd = React.lazy(() => import('pages/CustomerWorking/pages/CustomerWorkingAdd'));
const CustomerWorkingEdit = React.lazy(() => import('pages/CustomerWorking/pages/CustomerWorkingEdit'));
const CustomerWorkingDetail = React.lazy(() => import('pages/CustomerWorking/pages/CustomerWorkingDetail'));

const customerWorkingRoute = [
  {
    path: '/customer-working',
    exact: true,
    name: 'Danh sách khách hàng Walk in',
    function: PERMISSION.VIEW,
    component: CustomerWorking,
  },
  {
    path: '/customer-working/add',
    exact: true,
    name: 'Thêm mới khách hàng Walk in',
    function: PERMISSION.ADD,
    component: CustomerWorkingAdd,
  },
  {
    path: '/customer-working/edit/:customer_working_id',
    exact: true,
    name: 'Chỉnh sửa khách hàng Walk in',
    function: PERMISSION.EDIT,
    component: CustomerWorkingEdit,
  },
  {
    path: '/customer-working/detail/:customer_working_id',
    exact: true,
    name: 'Chi tiết khách hàng Walk in',
    function: PERMISSION.VIEW,
    component: CustomerWorkingDetail,
  },
];

export default customerWorkingRoute;
