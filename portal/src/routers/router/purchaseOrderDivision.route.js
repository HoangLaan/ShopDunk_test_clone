import React from 'react';
import { PURCHASE_ORDER_DIVISION_PERMISSION } from 'pages/PurchaseOrderDivision/utils/constants';

const PurchaseOrderDivision = React.lazy(() => import('pages/PurchaseOrderDivision/pages/PurchaseOrderDivision'));
const PurchaseOrderDivisionAdd = React.lazy(() => import('pages/PurchaseOrderDivision/pages/PurchaseOrderDivisionAdd'));

const purchaseOrderDivisionRoute = [
  {
    path: '/purchase-order-division',
    exact: true,
    name: 'Danh sách chia hàng',
    function: PURCHASE_ORDER_DIVISION_PERMISSION.VIEW,
    component: PurchaseOrderDivision,
  },
  {
    path: '/purchase-order-division/add',
    exact: true,
    name: 'Thêm mới chia hàng',
    function: PURCHASE_ORDER_DIVISION_PERMISSION.ADD,
    component: PurchaseOrderDivisionAdd,
  },
  {
    path: '/purchase-order-division/edit/:id',
    exact: true,
    name: 'Chỉnh sửa chia hàng',
    function: PURCHASE_ORDER_DIVISION_PERMISSION.EDIT,
    component: PurchaseOrderDivisionAdd,
  },
  {
    path: '/purchase-order-division/detail/:id',
    exact: true,
    name: 'Chi tiết chia hàng',
    function: PURCHASE_ORDER_DIVISION_PERMISSION.VIEW,
    component: PurchaseOrderDivisionAdd,
  },
];

export default purchaseOrderDivisionRoute;
