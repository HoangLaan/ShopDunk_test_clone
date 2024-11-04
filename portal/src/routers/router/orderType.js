import React from 'react';

const OrderType = React.lazy(() => import('pages/OrderType/OrderType'));
const OrderTypeEdit = React.lazy(() => import('pages/OrderType/OrderTypeEdit'));
const OrderTypeAdd = React.lazy(() => import('pages/OrderType/OrderTypeAdd'));
const OrderTypeDetail = React.lazy(() => import('pages/OrderType/OrderTypeDetail'));

const orderType = [
  {
    path: '/order-type',
    exact: true,
    name: 'Danh sách loại đơn hàng',
    function: 'SL_ORDERTYPE_VIEW',
    component: OrderType,
  },
  {
    path: '/order-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại đơn hàng',
    function: 'SL_ORDERTYPE_EDIT',
    component: OrderTypeEdit,
  },
  {
    path: '/order-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại đơn hàng',
    function: 'SL_ORDERTYPE_VIEW',
    component: OrderTypeDetail,
  },
  {
    path: '/order-type/add',
    exact: true,
    name: 'Thêm mới loại đơn hàng',
    function: 'SL_ORDERTYPE_ADD',
    component: OrderTypeAdd,
  },
];

export default orderType;
