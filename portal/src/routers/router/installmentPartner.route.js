import React from 'react';

const DefaultPage = React.lazy(() => import('pages/InstallmentPartner/pages/ListPage'));
const AddPage = React.lazy(() => import('pages/InstallmentPartner/pages/AddPage'));
const DetailPage = React.lazy(() => import('pages/InstallmentPartner/pages/DetailPage'));
const EditPage = React.lazy(() => import('pages/InstallmentPartner/pages/EditPage'));

const FunctionGroupRoutes = [
  {
    path: '/installment-partner',
    exact: true,
    name: 'Danh sách đối tác trả góp',
    function: 'SL_INSTALLMENTPARTNER_VIEW',
    component: DefaultPage,
  },
  {
    path: '/installment-partner/add',
    exact: true,
    name: 'Thêm mới đối tác trả góp',
    function: 'SL_INSTALLMENTPARTNER_ADD',
    component: AddPage,
  },
  {
    path: '/installment-partner/detail/:id',
    exact: true,
    name: 'Chi tiết đối tác trả góp',
    function: 'SL_INSTALLMENTPARTNER_VIEW',
    component: DetailPage,
  },
  {
    path: '/installment-partner/edit/:id',
    exact: true,
    name: 'Chỉnh sửa đối tác trả góp',
    function: 'SL_INSTALLMENTPARTNER_EDIT',
    component: EditPage,
  },
];

export default FunctionGroupRoutes;
