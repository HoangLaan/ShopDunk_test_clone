import React from 'react'

const StocksTransferType = React.lazy(() => import('pages/StocksTransferType/StocksTransferType'));
const StocksTransferTypeAdd = React.lazy(() => import('pages/StocksTransferType/StocksTransferTypeAdd'));
const StocksTransferTypeEdit = React.lazy(() => import('pages/StocksTransferType/StocksTransferTypeEdit'));
const StocksTransferTypeDetail = React.lazy(() => import('pages/StocksTransferType/StocksTransferTypeDetail'));

const stocksTransferTypeRoutes = [
    {
        path: '/stocks-transfer-type',
        exact: true,
        name: 'Danh sách hình thức luân chuyển kho',
        function: 'ST_STOCKSTRANSFERTYPE_VIEW',
        component: StocksTransferType,
    },
    {
        path: '/stocks-transfer-type/add',
        exact: true,
        name: 'Thêm mới hình thức luân chuyển kho',
        function: 'ST_STOCKSTRANSFERTYPE_ADD',
        component: StocksTransferTypeAdd,
    },
    {
        path: '/stocks-transfer-type/detail/:id',
        exact: true,
        name: 'Chi tiết hình thức luân chuyển kho',
        function: 'ST_STOCKSTRANSFERTYPE_VIEW',
        component: StocksTransferTypeDetail,
    },
    {
        path: '/stocks-transfer-type/edit/:id',
        exact: true,
        name: 'Chỉnh sửa hình thức luân chuyển kho',
        function: 'ST_STOCKSTRANSFERTYPE_EDIT',
        component: StocksTransferTypeEdit,
    },
]

export default stocksTransferTypeRoutes
