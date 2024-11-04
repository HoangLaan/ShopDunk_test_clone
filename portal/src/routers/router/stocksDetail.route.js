import React from 'react';

const StocksDetailPage = React.lazy(() => import('pages/StocksDetail/StocksDetailPage.js'));
const StocksDetailProduct = React.lazy(() => import('pages/StocksDetail/StocksDetailProduct.js'));
const StocksDetailHistory = React.lazy(() => import('pages/StocksDetail/StocksDetailHistory.js'));

const stocksDetailRoute = [
  {
    path: '/stocks-detail',
    exact: true,
    name: 'Danh sách tồn kho',
    function: 'ST_STOCKSDETAIL_VIEW',
    component: StocksDetailPage,
  },

  {
    path: '/stocks-detail/detail/:stocksId/:productId/:materialId',
    exact: true,
    name: 'Chi tiết tồn kho',
    function: 'ST_STOCKSDETAIL_VIEW',
    component: StocksDetailProduct,
  },
  {
    path: '/stocks-detail/history/:productImeiCode',
    exact: true,
    name: 'Lịch sử lưu kho',
    function: 'ST_STOCKSDETAIL_VIEW',
    component: StocksDetailHistory,
  },
  {
    path: '/stocks-detail/out-calculate-pricing',
    exact: true,
    name: 'Danh sách tồn kho',
    function: 'COGS_VIEW',
    component: StocksDetailPage,
  },
];

export default stocksDetailRoute;
