import React from 'react';

const PaymentFormAddPage = React.lazy(() => import('pages/PaymentForm/PaymentFormAddPage'));
const PaymentFormPage = React.lazy(() => import('pages/PaymentForm/PaymentFormPage'));

const paymentForm = [
  {
    path: '/payment-form',
    exact: true,
    name: 'Danh sách hình thức thanh toán',
    function: 'AC_PAYMENTFORM_VIEW',
    component: PaymentFormPage,
  },
  {
    path: '/payment-form/add',
    exact: true,
    name: 'Thêm mới hình thức thanh toán',
    function: 'AC_PAYMENTFORM_ADD',
    component: PaymentFormAddPage,
  },
  {
    path: '/payment-form/edit/:payment_form_id',
    exact: true,
    name: 'Chỉnh sửa hình thức thanh toán',
    function: 'AC_PAYMENTFORM_EDIT',
    component: PaymentFormAddPage,
  },
  {
    path: '/payment-form/detail/:payment_form_id',
    exact: true,
    name: 'Chi tiết hình thức thanh toán',
    function: 'AC_PAYMENTFORM_VIEW',
    component: PaymentFormAddPage,
  },
];

export default paymentForm;
