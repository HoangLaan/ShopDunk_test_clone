import React from 'react';

const CustomerType = React.lazy(() => import('pages/CustomerType/CustomerType'));
const CustomerTypeAdd = React.lazy(() => import('pages/CustomerType/CustomerTypeAdd'));
const CustomerTypeEdit = React.lazy(() => import('pages/CustomerType/CustomerTypeEdit'));
const CustomerTypeDetail = React.lazy(() => import('pages/CustomerType/CustomerTypeDetail'));

const customerType = [
  {
    path: '/customer-type',
    exact: true,
    name: 'Danh sách hạng khách hàng',
    function: 'CRM_CUSTOMERTYPE_VIEW',
    component: CustomerType,
  },
  {
    path: '/customer-type/add',
    exact: true,
    name: 'Thêm mới hạng khách hàng',
    function: 'CRM_CUSTOMERTYPE_ADD',
    component: CustomerTypeAdd,
  },
  {
    path: '/customer-type/detail/:id',
    exact: true,
    name: 'Chi tiết hạng khách hàng',
    function: 'CRM_CUSTOMERTYPE_VIEW',
    component: CustomerTypeDetail,
  },
  {
    path: '/customer-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hạng khách hàng',
    function: 'CRM_CUSTOMERTYPE_EDIT',
    component: CustomerTypeEdit,
  },
];

export default customerType;
