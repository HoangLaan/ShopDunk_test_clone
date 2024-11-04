import React from 'react';

const AccountingAccountAddPage = React.lazy(() => import('pages/AccountingAccount/AccountingAccountAddPage'));
const AccountingAccountPage = React.lazy(() => import('pages/AccountingAccount/AccountingAccountPage'));

const accountingAccount = [
  {
    path: '/accounting-account',
    exact: true,
    name: 'Danh sách tài khoản kế toán',
    function: 'AC_ACCOUNTINGACCOUNT_VIEW',
    component: AccountingAccountPage,
  },
  {
    path: '/accounting-account/add',
    exact: true,
    name: 'Thêm mới tài khoản kế toán',
    function: 'AC_ACCOUNTINGACCOUNT_ADD',
    component: AccountingAccountAddPage,
  },
  {
    path: '/accounting-account/edit/:accounting_account_id',
    exact: true,
    name: 'Chỉnh sửa tài khoản kế toán',
    function: 'AC_ACCOUNTINGACCOUNT_EDIT',
    component: AccountingAccountAddPage,
  },
  {
    path: '/accounting-account/copy/:accounting_account_id',
    exact: true,
    name: 'Sao chép tài khoản kế toán',
    function: 'AC_ACCOUNTINGACCOUNT_COPY',
    component: AccountingAccountAddPage,
  },
];

export default accountingAccount;
