import React from 'react';

const DefaultPage = React.lazy(() => import('pages/AccountingPeriod/pages/DefaultPage'));
const AddPage = React.lazy(() => import('pages/AccountingPeriod/pages/AddPage'));
const DetailPage = React.lazy(() => import('pages/AccountingPeriod/pages/DetailPage'));
const EditPage = React.lazy(() => import('pages/AccountingPeriod/pages/EditPage'));

const FunctionGroupRoutes = [
  {
    path: '/accounting-period',
    exact: true,
    name: 'Danh sách kỳ kế toán',
    function: 'MD_ACCOUNTINGPERIOD_VIEW',
    component: DefaultPage,
  },
  {
    path: '/accounting-period/add',
    exact: true,
    name: 'Thêm mới kỳ kế toán',
    function: 'MD_ACCOUNTINGPERIOD_ADD',
    component: AddPage,
  },
  {
    path: '/accounting-period/detail/:id',
    exact: true,
    name: 'Chi tiết kỳ kế toán',
    function: 'MD_ACCOUNTINGPERIOD_VIEW',
    component: DetailPage,
  },
  {
    path: '/accounting-period/edit/:id',
    exact: true,
    name: 'Chỉnh sửa kỳ kế toán',
    function: 'MD_ACCOUNTINGPERIOD_EDIT',
    component: EditPage,
  },
];

export default FunctionGroupRoutes;
