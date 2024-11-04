import React from 'react';

const StocksTransfer = React.lazy(() => import('pages/StocksTransfer/pages/StocksTransferPage'));
const StocksTransferAdd = React.lazy(() => import('pages/StocksTransfer/pages/StocksTransferAdd'));
const StocksTransferEdit = React.lazy(() => import('pages/StocksTransfer/pages/StocksTransferEdit'));
const StocksTransferDetail = React.lazy(() => import('pages/StocksTransfer/pages/StocksTransferDetail'));

const stocksTransferRoute = [
  {
    path: '/stocks-transfer',
    exact: true,
    name: 'Danh sách phiếu chuyển kho',
    function: 'ST_STOCKSTRANSFER_VIEW',
    component: StocksTransfer,
  },
  {
    path: '/stocks-transfer/add',
    exact: true,
    name: 'Thêm mới phiếu chuyển kho',
    function: 'ST_STOCKSTRANSFER_ADD',
    component: StocksTransferAdd,
  },
  {
    path: '/stocks-transfer/detail/:id',
    exact: true,
    name: 'Chi tiết phiếu chuyển kho',
    function: 'ST_STOCKSTRANSFER_VIEW',
    component: StocksTransferDetail,
  },
  {
    path: '/stocks-transfer/edit/:id',
    exact: true,
    name: 'Chỉnh sửa phiếu chuyển kho',
    function: 'ST_STOCKSTRANSFER_EDIT',
    component: StocksTransferEdit,
  },
];

export default stocksTransferRoute;
