import React from 'react'
import { PERMISSION } from 'pages/RequestPurchaseOrder/helpers/constants';

const RequestPurchaseOrder = React.lazy(() => import('pages/RequestPurchaseOrder/pages/RequestPurchaseOrder'));
const RequestPurchaseOrderAdd = React.lazy(() => import('pages/RequestPurchaseOrder/pages/RequestPurchaseOrderAdd'));
const RequestPurchaseOrderEdit = React.lazy(() => import('pages/RequestPurchaseOrder/pages/RequestPurchaseOrderEdit'));
const RequestPurchaseOrderDetail = React.lazy(() => import('pages/RequestPurchaseOrder/pages/RequestPurchaseOrderDetail'));

const requestPurchaseOrderRoute = [
    {
        path: '/request-purchase-order',
        exact: true,
        name: 'Danh sách đơn đặt hàng',
        function: PERMISSION.VIEW,
        component: RequestPurchaseOrder,
    },
    {
        path: '/request-purchase-order/add',
        exact: true,
        name: 'Thêm mới đơn đặt hàng',
        function: PERMISSION.ADD,
        component: RequestPurchaseOrderAdd,
    },
    {
        path: '/request-purchase-order/detail/:id',
        exact: true,
        name: 'Chi tiết đơn đặt hàng',
        function: PERMISSION.VIEW,
        component: RequestPurchaseOrderDetail,
    },
    {
        path: '/request-purchase-order/edit/:id',
        exact: true,
        name: 'Chỉnh sửa đơn đặt hàng',
        function: PERMISSION.EDIT,
        component: RequestPurchaseOrderEdit,
    },
]

export default requestPurchaseOrderRoute
