import React from 'react';

const Orders = React.lazy(() => import('pages/Orders/pages/OrdersPage'));
const OrdersAdd = React.lazy(() => import('pages/Orders/pages/OrdersAdd'));
const OrdersEdit = React.lazy(() => import('pages/Orders/pages/OrdersEdit'));
const OrdersDetail = React.lazy(() => import('pages/Orders/pages/OrdersDetail'));
const OrdersPayment = React.lazy(() => import('pages/Orders/pages/OrdersPayment'));

const orders = [
  {
    path: '/orders',
    exact: true,
    name: 'Danh sách đơn hàng',
    function: 'SL_ORDER_VIEW',
    component: Orders,
  },
  {
    path: '/orders/add',
    exact: true,
    name: 'Thêm mới đơn hàng',
    function: 'SL_ORDER_ADD',
    component: OrdersAdd,
  },
  {
    path: '/orders/edit/:id',
    exact: true,
    name: 'Chỉnh sửa đơn hàng',
    function: 'SL_ORDER_EDIT',
    component: OrdersEdit,
  },
  {
    path: '/orders/detail/:id',
    exact: true,
    name: 'Chi tiết đơn hàng',
    function: 'SL_ORDER_EDIT',
    component: OrdersDetail,
  },
  {
    path: '/orders/payment/:order_id',
    exact: true,
    name: 'Thông tin thanh toán đơn hàng',
    function: 'SL_ORDER_EDIT',
    component: OrdersPayment,
  },
];

export default orders;
