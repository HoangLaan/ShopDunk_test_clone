import React from 'react';

const BankPage = React.lazy(() => import('pages/Bank/BankPage'));
const BankAddPage = React.lazy(() => import('pages/Bank/BankAddPage'));

const bankRoute = [
  {
    path: '/bank',
    exact: true,
    name: 'Danh sách ngân hàng',
    function: 'MD_BANK_VIEW',
    component: BankPage,
  },
  {
    path: '/bank/add',
    exact: true,
    name: 'Thêm mới ngân hàng',
    function: 'MD_BANK_ADD',
    component: BankAddPage,
  },
  {
    path: '/bank/edit/:bank_id',
    exact: true,
    name: 'Chỉnh sửa ngân hàng',
    function: 'MD_BANK_EDIT',
    component: BankAddPage,
  },
  {
    path: '/bank/detail/:bank_id',
    exact: true,
    name: 'Chi tiết ngân hàng',
    function: 'MD_BANK_VIEW',
    component: BankAddPage,
  },
];

export default bankRoute;
