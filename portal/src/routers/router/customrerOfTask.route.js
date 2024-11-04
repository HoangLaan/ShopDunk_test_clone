import React from 'react';

const DefaultPage = React.lazy(() => import('pages/CustomerOfTask/pages/CustomerOfTaskFormList'));
const AddPage = React.lazy(() => import('pages/CustomerOfTask/pages/CustomerOfTaskFormAdd'));
const DetailPage = React.lazy(() => import('pages/CustomerOfTask/pages/CustomerOfTaskFormDetail'));
const EditPage = React.lazy(() => import('pages/CustomerOfTask/pages/CustomerOfTaskFormEdit'));

const FunctionGroupRoutes = [
  {
    path: '/customer-of-task',
    exact: true,
    name: 'Danh sách khách hàng thuộc công việc',
    function: 'CRM_CUSTOMEROFTASK_VIEW',
    component: DefaultPage,
  },
  {
    path: '/customer-of-task/add',
    exact: true,
    name: 'Thêm mới khách hàng thuộc công việc',
    function: 'CRM_CUSTOMEROFTASK_ADD',
    component: AddPage,
  },
  {
    path: '/customer-of-task/detail/:id',
    exact: true,
    name: 'Chi tiết khách hàng thuộc công việc',
    function: 'CRM_CUSTOMEROFTASK_VIEW',
    component: DetailPage,
  },
  {
    path: '/customer-of-task/edit/:id',
    exact: true,
    name: 'Chỉnh sửa khách hàng thuộc công việc',
    function: 'CRM_CUSTOMEROFTASK_EDIT',
    component: EditPage,
  },
];

export default FunctionGroupRoutes;
