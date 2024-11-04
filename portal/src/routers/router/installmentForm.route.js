import React from 'react';

const DefaultPage = React.lazy(() => import('pages/InstallmentForm/pages/ListPage'));
const AddPage = React.lazy(() => import('pages/InstallmentForm/pages/AddPage'));
const DetailPage = React.lazy(() => import('pages/InstallmentForm/pages/DetailPage'));
const EditPage = React.lazy(() => import('pages/InstallmentForm/pages/EditPage'));

const FunctionGroupRoutes = [
  {
    path: '/installment-form',
    exact: true,
    name: 'Danh sách hình thức trả góp',
    function: 'SL_INSTALLMENTFORM_VIEW',
    component: DefaultPage,
  },
  {
    path: '/installment-form/add',
    exact: true,
    name: 'Thêm mới hình thức trả góp',
    function: 'SL_INSTALLMENTFORM_ADD',
    component: AddPage,
  },
  {
    path: '/installment-form/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức trả góp',
    function: 'SL_INSTALLMENTFORM_VIEW',
    component: DetailPage,
  },
  {
    path: '/installment-form/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức trả góp',
    function: 'SL_INSTALLMENTFORM_EDIT',
    component: EditPage,
  },
];

export default FunctionGroupRoutes;
