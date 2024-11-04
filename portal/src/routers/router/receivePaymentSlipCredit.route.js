import React from 'react';

const ReceivePaymentSlipPage = React.lazy(() => import('pages/ReceivePaymentSlipCredit/pages/ListPage'));
const ReceivePaymentSlipAddPage = React.lazy(() => import('pages/ReceivePaymentSlipCredit/pages/AddPage'));
const ReceivePaymentSlipEditPage = React.lazy(() => import('pages/ReceivePaymentSlipCredit/pages/EditPage'));
const ReceivePaymentSlipCopyPage = React.lazy(() => import('pages/ReceivePaymentSlipCredit/pages/CopyPage'));
const ReceivePaymentSlipDetailPage = React.lazy(() => import('pages/ReceivePaymentSlipCredit/pages/DetailPage'));

const receiveSlipRoute = [
  {
    path: '/receive-payment-slip-credit',
    exact: true,
    name: 'Danh sách thu, chi tiền gửi ngân hàng',
    function: 'SL_RECEIVE_PAYMENT_CREDIT_VIEW',
    component: ReceivePaymentSlipPage,
  },
  {
    path: '/receive-payment-slip-credit/add',
    exact: true,
    name: 'Thêm mới ủy nhiệm',
    function: 'SL_RECEIVE_PAYMENT_CREDIT_ADD',
    component: ReceivePaymentSlipAddPage,
  },
  {
    path: '/receive-payment-slip-credit/detail/:id',
    exact: true,
    name: 'Chi tiết ủy nhiệm',
    function: 'SL_RECEIVE_PAYMENT_CREDIT_VIEW',
    component: ReceivePaymentSlipDetailPage,
  },
  {
    path: '/receive-payment-slip-credit/edit/:id',
    exact: true,
    name: 'Chỉnh sửa ủy nhiệm',
    function: 'SL_RECEIVE_PAYMENT_CREDIT_EDIT',
    component: ReceivePaymentSlipEditPage,
  },
  {
    path: '/receive-payment-slip-credit/copy/:id',
    exact: true,
    name: 'Sao chép ủy nhiệm',
    function: 'SL_RECEIVE_PAYMENT_CREDIT_ADD',
    component: ReceivePaymentSlipCopyPage,
  },
];

export default receiveSlipRoute;
