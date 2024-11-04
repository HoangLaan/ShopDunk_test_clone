import React from 'react';

const OrderStatusPage = React.lazy(() => import('pages/OrderStatus/OrderStatusPage'));
const OrderStatusAddPage = React.lazy(() => import('pages/OrderStatus/OrderStatusAddPage'));

const orderStatus = [
  {
    path: '/order-status',
    exact: true,
    name: 'Danh sách trạng thái đơn hàng',
    function: 'SL_ORDERSTATUS_VIEW',
    component: OrderStatusPage,
  },
  {
    path: '/order-status/add',
    exact: true,
    name: 'Thêm mới trạng thái đơn hàng',
    function: 'SL_ORDERSTATUS_ADD',
    component: OrderStatusAddPage,
  },
  {
    path: '/order-status/view/:order_status_id',
    exact: true,
    name: 'Chi tiết trạng thái đơn hàng',
    function: 'SL_ORDERSTATUS_VIEW',
    component: OrderStatusAddPage,
  },
  {
    path: '/order-status/edit/:order_status_id',
    exact: true,
    name: 'Chỉnh sửa trạng thái đơn hàng',
    function: 'SL_ORDERSTATUS_EDIT',
    component: OrderStatusAddPage,
  },
];

export default orderStatus;
