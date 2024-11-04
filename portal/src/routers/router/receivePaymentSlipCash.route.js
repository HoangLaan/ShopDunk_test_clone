import React from 'react';

const ReceivePaymentSlipPage = React.lazy(() => import('pages/ReceivePaymentSlipCash/pages/ListPage'));
const ReceivePaymentSlipAddPage = React.lazy(() => import('pages/ReceivePaymentSlipCash/pages/AddPage'));
const ReceivePaymentSlipEditPage = React.lazy(() => import('pages/ReceivePaymentSlipCash/pages/EditPage'));
const ReceivePaymentSlipCopyPage = React.lazy(() => import('pages/ReceivePaymentSlipCash/pages/CopyPage'));
const ReceivePaymentSlipDetailPage = React.lazy(() => import('pages/ReceivePaymentSlipCash/pages/DetailPage'));

const receiveSlipRoute = [
  {
    path: '/receive-payment-slip-cash',
    exact: true,
    name: 'Danh sách thu, chi tiền mặt',
    function: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
    component: ReceivePaymentSlipPage,
  },
  {
    path: '/receive-payment-slip-cash/add',
    exact: true,
    name: 'Thêm mới phiếu',
    function: 'SL_RECEIVE_PAYMENT_CASH_ADD',
    component: ReceivePaymentSlipAddPage,
  },
  {
    path: '/receive-payment-slip-cash/detail/:id',
    exact: true,
    name: 'Chi tiết phiếu',
    function: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
    component: ReceivePaymentSlipDetailPage,
  },
  {
    path: '/receive-payment-slip-cash/edit/:id',
    exact: true,
    name: 'Chỉnh sửa phiếu',
    function: 'SL_RECEIVE_PAYMENT_CASH_EDIT',
    component: ReceivePaymentSlipEditPage,
  },
  {
    path: '/receive-payment-slip-cash/copy/:id',
    exact: true,
    name: 'Sao chép phiếu',
    function: 'SL_RECEIVE_PAYMENT_CASH_ADD',
    component: ReceivePaymentSlipCopyPage,
  },
];

export default receiveSlipRoute;
