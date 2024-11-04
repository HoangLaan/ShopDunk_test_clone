import React from 'react';
import { PURCHASE_ORDER_PERMISSIONS } from 'pages/PurchaseOrder/helpers/constants';

const PurchaseOrders = React.lazy(() => import('pages/PurchaseOrder/PurchaseOrders'));
const PurchaseOrdersAdd = React.lazy(() => import('pages/PurchaseOrder/PurchaseOrdersAdd'));
const PurchaseOrdersReturned = React.lazy(() => import('pages/PurchaseOrderReturned/PurchaseOrdersReturned'));

const purchaseOrdersRoutes = [
  {
    path: '/purchase-orders',
    exact: true,
    name: 'Danh sách đơn mua hàng',
    function: PURCHASE_ORDER_PERMISSIONS.VIEW,
    component: PurchaseOrders,
  },
  {
    path: '/purchase-orders/add',
    exact: true,
    name: 'Thêm mới đơn mua hàng',
    function: PURCHASE_ORDER_PERMISSIONS.ADD,
    component: PurchaseOrdersAdd,
  },
  {
    path: '/purchase-orders/edit/:id',
    exact: true,
    name: 'Chỉnh sửa đơn mua hàng',
    function: PURCHASE_ORDER_PERMISSIONS.EDIT,
    component: PurchaseOrdersAdd,
  },
  {
    path: '/purchase-orders/detail/:id',
    exact: true,
    name: 'Chi tiết đơn mua hàng',
    function: PURCHASE_ORDER_PERMISSIONS.VIEW,
    component: PurchaseOrdersAdd,
  },
  {
    path: '/purchase-orders-returned',
    exact: true,
    name: 'Danh sách hàng bán trả lại',
    function: PURCHASE_ORDER_PERMISSIONS.VIEW,
    component: PurchaseOrdersReturned,
  },
  {
    path: '/purchase-orders-returned/add',
    exact: true,
    name: 'Thêm mới hàng bán trả lại',
    function: PURCHASE_ORDER_PERMISSIONS.ADD,
    component: () => <PurchaseOrdersAdd isReturned={true} />,
  },
];

export default purchaseOrdersRoutes;
